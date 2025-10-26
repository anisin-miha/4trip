"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { InputMask } from "@react-input/mask";
import { toast } from "sonner";
import { Link as IntlLink } from "@/i18n/navigation";

// ---- УТИЛИТЫ ----
/** Возвращает все даты выходных (сб и вс) от start до конца года (включительно). */
function getWeekendsUntilEndOfYear(start: Date): Date[] {
  const res: Date[] = [];
  const year = start.getFullYear();
  const end = new Date(year, 11, 31); // 11 = декабрь (месяцы 0..11)

  // нормализуем к полуночи, чтобы избежать проблем со сравнением дат
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  d.setHours(0, 0, 0, 0);

  while (d <= end) {
    const dow = d.getDay(); // 0=вс (Sunday), 6=сб (Saturday)
    if (dow === 6 || dow === 0) {
      // добавляем и субботы, и воскресенья
      res.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return res;
}

// ---- ДАННЫЕ ----
// все выходные с 1 мая 2025 по 31 декабря 2025
export const availableDates = getWeekendsUntilEndOfYear(new Date(2025, 4, 1));

// ---- ТИПЫ ----
interface BookingFormProps {
  price: number;
  tourName: string;
  timeSlots?: string[];
}

type ProgramType = "standard" | "individual";

type TrafficSource =
  | "search"
  | "ads"
  | "social"
  | "referral"
  | "blog"
  | "other"
  | "unknown";

const TRAFFIC_OPTIONS: { value: TrafficSource; label: string }[] = [
  { value: "search", label: "Поиск (Яндекс/Google)" },
  { value: "ads", label: "Реклама" },
  { value: "social", label: "Соцсети" },
  { value: "referral", label: "Рекомендация друзей" },
  { value: "blog", label: "Из блога/статьи" },
  { value: "other", label: "Другое" },
  { value: "unknown", label: "Не помню" },
];

// ---- СХЕМЫ ВАЛИДАЦИИ ----
function getStandardSchema(requireSlot: boolean) {
  return z.object({
    name: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 2, {
        message: "Имя должно быть не короче 2 символов",
      }),
    phone: z
      .string()
      .nonempty("Введите номер телефона")
      .refine((val) => val.replace(/\D/g, "").length === 11, {
        message: "Введите корректный номер телефона",
      }),
    email: z
      .string()
      .optional()
      .refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
        message: "Введите корректный email",
      }),
    date: z
      .string()
      .nonempty("Выберите дату")
      .refine((val) => {
        if (!val) return false;
        const d = new Date(val);
        if (isNaN(d.getTime())) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const picked = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        return picked > today; // запрещаем сегодня и прошлые даты
      }, "Нельзя бронировать на сегодня и прошедшие даты"),
    // Slot is required when timeSlots are provided by parent
    slot: requireSlot
      ? z.string().nonempty("Выберите время")
      : z.string().optional(),
    people: z.string().refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 1;
      },
      { message: "Минимум 1 человек" },
    ),
    consent: z
      .boolean()
      .refine((val) => val === true, {
        message: "Необходимо согласие на обработку данных",
      }),
    trafficSource: z
      .enum([
        "search",
        "ads",
        "social",
        "referral",
        "blog",
        "other",
        "unknown",
      ] as const)
      .optional(),
    trafficDetails: z.string().optional(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
  });
}

const groupSchema = z.object({
  name: z.string().min(2, "Имя должно быть не короче 2 символов"),
  phone: z
    .string()
    .nonempty("Введите номер телефона")
    .refine(
      (val) => val.replace(/\D/g, "").length === 11,
      "Введите корректный номер телефона",
    ),
  email: z.string().email("Введите корректный email").optional(),
  comment: z.string().min(10, "Опишите ваши пожелания подробнее"),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "Необходимо согласие на обработку данных",
    }),
  trafficSource: z
    .enum([
      "search",
      "ads",
      "social",
      "referral",
      "blog",
      "other",
      "unknown",
    ] as const)
    .optional(),
  trafficDetails: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

// ---- Автосбор UTM/Referrer ----
function parseSearchParams(search: string) {
  const params = new URLSearchParams(search);
  return {
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
  } as const;
}

function detectTrafficSource(utm: {
  utmSource: string;
  utmMedium: string;
}): TrafficSource {
  const src = (utm.utmSource || "").toLowerCase();
  const med = (utm.utmMedium || "").toLowerCase();
  const is = (s: string, arr: string[]) => arr.some((x) => s.includes(x));
  if (is(src, ["yandex", "google"])) return "search";
  if (is(src, ["t.me", "telegram", "vk", "instagram", "facebook"]))
    return "social";
  if (is(med, ["cpc", "ppc", "ads", "adwords", "context"])) return "ads";
  if (is(src, ["blog"])) return "blog";
  return "unknown";
}

// ---- BookingCalendar ----
const BookingCalendar: React.FC<{
  date: string | undefined;
  onChange: (date: string) => void;
  renderLabel?: boolean;
  buttonId?: string;
}> = ({ date, onChange, renderLabel = true, buttonId }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      {renderLabel && (
        <label
          htmlFor={buttonId ?? "date"}
          className="block mb-2 font-semibold"
        >
          Выберите дату
        </label>
      )}
      <button
        id={buttonId ?? "date"}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 border rounded-lg text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
      >
        <span>
          {date ? new Date(date).toLocaleDateString("ru-RU") : "Выбрать дату"}
        </span>
        <CalendarIcon className="w-5 h-5 text-gray-500 ml-2" />
      </button>
      {open && (
        <div className="absolute z-10 mt-2 bg-white border rounded-lg p-2 shadow-md">
          <Calendar
            mode="single"
            weekStartsOn={1}
            selected={date ? new Date(date) : undefined}
            onSelect={(selected) => {
              if (selected) {
                onChange(selected.toISOString());
                setOpen(false);
              }
            }}
            disabled={(day) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const d = new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate(),
              );
              const isPastOrToday = d <= today;
              const isAvailable = availableDates.some(
                (available) => available.toDateString() === day.toDateString(),
              );
              return isPastOrToday || !isAvailable;
            }}
            locale={ru}
          />
        </div>
      )}
    </div>
  );
};

// ---- BookingForm ----
export default function BookingForm({
  price,
  tourName,
  timeSlots,
}: BookingFormProps) {
  // If the parent passes timeSlots, we'll allow selecting one in the form
  // The input name will be `slot` and it's optional unless provided
  // We register it with react-hook-form below when rendering slots
  const [programType, setProgramType] = useState<ProgramType>("standard");
  const [sent, setSent] = useState(false);
  const [selectedSlotState, setSelectedSlotState] = useState<
    string | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(
      // require slot only when there are multiple choices to pick from
      programType === "standard"
        ? getStandardSchema(Boolean(timeSlots && timeSlots.length > 1))
        : groupSchema,
    ),
    defaultValues:
      programType === "standard"
        ? {
            people: "1",
            consent: false,
            trafficSource: undefined,
            trafficDetails: "",
            utmSource: "",
            utmMedium: "",
            utmCampaign: "",
          }
        : {
            consent: false,
            trafficSource: undefined,
            trafficDetails: "",
            utmSource: "",
            utmMedium: "",
            utmCampaign: "",
          },
  });

  const date = watch("date");
  const slot = watch("slot");
  const people = watch("people") || 1;
  const totalPrice = price * people;
  const selectedTrafficSource = watch("trafficSource");

  // Автозаполнение UTM и источника при монтировании
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { utmSource, utmMedium, utmCampaign } = parseSearchParams(
      window.location.search || "",
    );
    setValue("utmSource", utmSource);
    setValue("utmMedium", utmMedium);
    setValue("utmCampaign", utmCampaign);
    const detected = detectTrafficSource({ utmSource, utmMedium });
    if (detected) setValue("trafficSource", detected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If parent provides timeSlots, ensure slot is registered so validation can work
  useEffect(() => {
    if (timeSlots && timeSlots.length > 0) {
      // ensure react-hook-form knows about the slot field
      register("slot");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSlots]);

  // If there is exactly one time slot, auto-select it so validation doesn't force user action
  useEffect(() => {
    if (timeSlots && timeSlots.length === 1) {
      const only = timeSlots[0];
      setValue("slot", only);
      setSelectedSlotState(only);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSlots]);

  const onSubmit = async (data: any) => {
    try {
      if (programType === "standard") {
        const formattedDate = new Date(data.date).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const orderId = `tour-${tourName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`;
        const chosenSlot = data.slot
          ? String(data.slot)
          : slot
            ? String(slot)
            : undefined;
        // If parent provided timeSlots, require a selection
        if (timeSlots && timeSlots.length > 0 && !chosenSlot) {
          setError("slot", { type: "required", message: "Выберите время" });
          return;
        }
        const paymentDescription = `Оплата тура: ${tourName} (${formattedDate}${
          chosenSlot ? `, ${chosenSlot}` : ""
        })`;
        // debug: inspect slot values and payment description before sending
        // this helps trace why the slot might be missing in the outgoing payload
        // eslint-disable-next-line no-console
        console.log("booking debug", {
          dataSlot: data.slot,
          watchedSlot: slot,
          selectedSlotState,
          chosenSlot,
          paymentDescription,
        });

        await sendMessageToTelegram(
          data.name,
          data.phone,
          data.email || "",
          formattedDate,
          chosenSlot,
          data.people,
          tourName,
          data.trafficSource || "",
          data.trafficDetails || "",
          {
            source: data.utmSource || "",
            medium: data.utmMedium || "",
            campaign: data.utmCampaign || "",
          },
        );

        // Попытка создать платёжную ссылку (если настроен backend)
        try {
          const origin =
            typeof window !== "undefined"
              ? window.location.origin
              : "https://4-trip.ru";
          const res = await fetch("/api/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: Number(price) * Number(data.people || 1),
              currency: "RUB",
              orderId,
              description: paymentDescription,
              customer: { email: data.email || undefined, phone: data.phone },
              successUrl: `${origin}/ru?payment=success&order=${orderId}`,
              failUrl: `${origin}/ru?payment=failed&order=${orderId}`,
            }),
          });
          const json = await res.json();
          if (res.ok && json?.url) {
            window.location.href = json.url as string;
            return; // прерываем — далее редирект
          }
          // если не ок — просто продолжаем как обычная заявка
          console.warn("Payment link was not created:", json);
        } catch (err) {
          console.warn("Payment link creation failed:", err);
        }
      } else {
        await sendGroupRequest(
          data.name,
          data.phone,
          data.email || "",
          data.comment,
          tourName,
          data.trafficSource || "",
          data.trafficDetails || "",
          {
            source: data.utmSource || "",
            medium: data.utmMedium || "",
            campaign: data.utmCampaign || "",
          },
        );
      }
      setSent(true);
    } catch (error) {
      console.error("Ошибка отправки:", error);
      toast.error("Ошибка при отправке. Попробуйте позже.");
    }
  };

  const handleReset = () => {
    reset();
    setSent(false);
  };

  if (sent) {
    return (
      <div className="text-center space-y-6">
        <p className="text-xl font-semibold text-green-700">
          ✅ Заявка отправлена!
        </p>
        <p className="text-gray-600">Мы свяжемся с вами в ближайшее время.</p>
        <button
          onClick={handleReset}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-4">
        Забронируйте место
      </h2>
      <p className="text-center mb-8">
        {programType === "standard"
          ? "После заполнения мы свяжемся с вами и подтвердим вашу бронь"
          : "После заполнения мы свяжемся с вами для согласования деталей"}
      </p>

      {/* Переключатель программ */}
      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={() => setProgramType("standard")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            programType === "standard"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Стандартная программа
        </button>
        <button
          onClick={() => setProgramType("individual")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            programType === "individual"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Индивидуальная программа
        </button>
      </div>

      {/* Индивидуальная программа текст */}
      {programType === "individual" && (
        <div className="max-w-3xl mx-auto mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-blue-700">
            Индивидуальные экскурсии для организованных групп
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Удобные для вас дата и время выезда</li>
            <li>Индивидуальная программа экскурсии</li>
            <li>Удобное место подачи автобуса</li>
            <li>Согласование детских экскурсий</li>
            <li>Возможность добавить дополнительные объекты для посещения</li>
            <li>Для организованных групп — от 15 человек*</li>
          </ul>
          <p className="mt-4 text-gray-800">
            Мы разработаем маршрут с учётом ваших пожеланий! 🚍
          </p>
          <p className="mt-2 text-sm text-gray-500">
            *Минимальный размер группы — 15 человек. Для меньших групп условия
            оговариваются отдельно.
          </p>
        </div>
      )}

      {/* Форма — горизонтальная разметка */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Имя */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label
              htmlFor="name"
              className="md:w-56 font-semibold md:text-right"
            >
              Имя
            </label>
            <div className="flex-1">
              <input
                id="name"
                {...register("name")}
                autoComplete="name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.name?.message)}
                </p>
              )}
            </div>
          </div>

          {/* Телефон */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label
              htmlFor="phone"
              className="md:w-56 font-semibold md:text-right"
            >
              Телефон
            </label>
            <div className="flex-1">
              <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, value, ref, ...rest } }) => (
                  <InputMask
                    id="phone"
                    mask="+7 (___) ___-__-__"
                    replacement={{ _: /\d/ }}
                    showMask
                    value={value ?? ""}
                    onChange={onChange}
                    ref={ref}
                    inputMode="tel"
                    autoComplete="tel"
                    {...rest}
                    track={(trackingData) => {
                      const { inputType, data } = trackingData;

                      if (inputType === "insert" && data && data.length > 1) {
                        let digits = data.replace(/\D/g, "");
                        if (digits.length === 11) {
                          if (digits.startsWith("8")) {
                            digits = digits.substring(1);
                          } else if (digits.startsWith("7")) {
                            digits = digits.substring(1);
                          }
                        }
                        return digits;
                      }
                      return undefined;
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.phone?.message)}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label
              htmlFor="email"
              className="md:w-56 font-semibold md:text-right"
            >
              Email
            </label>
            <div className="flex-1">
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                {...register("email")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.email?.message)}
                </p>
              )}
            </div>
          </div>

          {/* Дата и кол-во человек (только для стандартной) */}
          {programType === "standard" && (
            <>
              {/* Дата */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <label
                  htmlFor="date"
                  className="md:w-56 font-semibold md:text-right"
                >
                  Дата
                </label>
                <div className="flex-1">
                  <BookingCalendar
                    date={date}
                    onChange={(value) => setValue("date", value)}
                    renderLabel={false}
                    buttonId="date"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">
                      {String(errors.date?.message)}
                    </p>
                  )}
                </div>
              </div>

              {/* Time slots selector */}
              {timeSlots && timeSlots.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                  <label className="md:w-56 font-semibold md:text-right">
                    Время
                  </label>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setValue("slot", t);
                            setSelectedSlotState(t);
                          }}
                          className={`px-3 py-2 rounded-md border transition focus:outline-none ${
                            slot === t || selectedSlotState === t
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    {/* Hidden input for form submission */}
                    <input type="hidden" {...register("slot")} />
                    {errors.slot && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.slot?.message)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Кол-во человек */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <label
                  htmlFor="people"
                  className="md:w-56 font-semibold md:text-right"
                >
                  Количество человек
                </label>
                <div className="flex-1">
                  <input
                    id="people"
                    type="number"
                    inputMode="numeric"
                    {...register("people", {
                      onChange: (e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, "");
                        e.target.value = onlyNumbers;
                      },
                      onBlur: (e) => {
                        const value = parseInt(e.target.value, 10);
                        if (!value || value < 1) {
                          e.target.value = "1";
                        }
                      },
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {errors.people && (
                    <p className="text-red-500 text-sm mt-1">
                      {String(errors.people?.message)}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Time slots (if provided by the parent) */}
          {programType === "standard" &&
            typeof ({} as any) /* placeholder for TS */ !== "undefined" && (
              // Note: the actual `timeSlots` prop is optional; we check below when rendering
              <></>
            )}

          {/* Источник трафика */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <label
              htmlFor="trafficSource"
              className="md:w-56 font-semibold md:text-right"
            >
              Как вы о нас узнали?
            </label>
            <div className="flex-1">
              <select
                id="trafficSource"
                {...register("trafficSource")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                defaultValue={selectedTrafficSource}
              >
                <option value="">Выберите вариант</option>
                {TRAFFIC_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedTrafficSource === "other" && (
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <label
                htmlFor="trafficDetails"
                className="md:w-56 font-semibold md:text-right"
              >
                Уточните, пожалуйста
              </label>
              <div className="flex-1">
                <input
                  id="trafficDetails"
                  {...register("trafficDetails")}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {/* Комментарий (только для групповой) */}
          {programType === "individual" && (
            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
              <label
                htmlFor="comment"
                className="md:w-56 font-semibold md:text-right pt-2"
              >
                Комментарий
              </label>
              <div className="flex-1">
                <textarea
                  id="comment"
                  {...register("comment")}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.comment?.message)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Чекбокс согласия */}
          <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
            <div className="md:w-56" />
            <div className="flex-1">
              <div className="flex items-start space-x-2">
                <input
                  id="consent"
                  type="checkbox"
                  {...register("consent")}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  Я соглашаюсь с{" "}
                  <IntlLink
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    политикой конфиденциальности
                  </IntlLink>
                  .
                </label>
              </div>
              {errors.consent && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.consent?.message)}
                </p>
              )}
            </div>
          </div>

          {/* Кнопка */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <div className="md:w-56" />
            <div className="flex-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
              </button>
            </div>
          </div>

          {/* Итоговая стоимость */}
          {programType === "standard" && (
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <div className="md:w-56 font-semibold md:text-right">Итого</div>
              <div className="flex-1">
                <div className="text-xl font-semibold text-gray-900">
                  {totalPrice.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// ---- ОТПРАВКА ЗАЯВОК ----
async function sendMessageToTelegram(
  name: string,
  phone: string,
  email: string,
  date: string,
  slot: string | undefined,
  people: number,
  tourName: string,
  trafficSource: string,
  trafficDetails: string,
  utm: { source: string; medium: string; campaign: string },
) {
  const traffic = trafficLabel(trafficSource);
  const message = `
📩 <b>Новая заявка на стандартный тур</b>
👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}
📅 Дата: ${date}
${slot ? `⏱ Время: ${slot}\n` : ""}
👥 Кол-во человек: ${people}
🚩 Тур: ${tourName}
🧭 Источник: ${traffic}${trafficDetails ? ` — ${trafficDetails}` : ""}
🔗 UTM-метки:
• Источник (utm_source): ${utm.source || "—"}
• Канал (utm_medium): ${utm.medium || "—"}
• Кампания (utm_campaign): ${utm.campaign || "—"}
      `.trim();

  // debug: show the exact telegram payload that will be sent
  // eslint-disable-next-line no-console
  console.log("telegram payload:", {
    message,
    name,
    phone,
    slot,
    people,
    tourName,
  });

  await fetch("https://telegram-proxy-tau.vercel.app/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
}

async function sendGroupRequest(
  name: string,
  phone: string,
  email: string,
  comment: string,
  tourName: string,
  trafficSource: string,
  trafficDetails: string,
  utm: { source: string; medium: string; campaign: string },
) {
  const traffic = trafficLabel(trafficSource);
  await fetch("https://telegram-proxy-tau.vercel.app/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `
📩 <b>Индивидуальная программа для группы</b>
👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}
📝 Комментарий: ${comment}
🚩 Тур: ${tourName}
🧭 Источник: ${traffic}${trafficDetails ? ` — ${trafficDetails}` : ""}
🔗 UTM-метки:
• Источник (utm_source): ${utm.source || "—"}
• Канал (utm_medium): ${utm.medium || "—"}
• Кампания (utm_campaign): ${utm.campaign || "—"}
      `.trim(),
    }),
  });
}

function trafficLabel(value: string): string {
  const found = TRAFFIC_OPTIONS.find((o) => o.value === (value as any));
  return found?.label || "—";
}
