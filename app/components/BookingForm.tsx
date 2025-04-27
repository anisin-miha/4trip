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

// ---- ДАННЫЕ ----
const availableDates = [
  new Date(2025, 4, 3),
  new Date(2025, 4, 4),
  new Date(2025, 4, 10),
  new Date(2025, 4, 11),
  new Date(2025, 4, 17),
  new Date(2025, 4, 18),
  new Date(2025, 4, 24),
  new Date(2025, 4, 25),
  new Date(2025, 4, 31),
];

// ---- ТИПЫ ----
interface BookingFormProps {
  price: number;
  tourName: string;
}

type ProgramType = "standard" | "individual";

// ---- СХЕМЫ ВАЛИДАЦИИ ----
const standardSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Имя должно быть не короче 2 символов",
    }),
  phone: z
    .string()
    .nonempty("Введите номер телефона")
    .refine(
      (val) => {
        // Убираем всё кроме цифр
        const digits = val.replace(/\D/g, "");
        return digits.length === 11; // Для России: 11 цифр (+7 и 10 цифр номера)
      },
      {
        message: "Введите корректный номер телефона",
      },
    ),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
      message: "Введите корректный email",
    }),
  date: z.string().nonempty("Выберите дату"),
  people: z.string().refine(
    (val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1;
    },
    {
      message: "Минимум 1 человек",
    },
  ),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Необходимо согласие на обработку данных" }),
  }),
});

z.setErrorMap((issue, ctx) => {
  switch (issue.code) {
    case "invalid_type":
      if (issue.received === "undefined") {
        return { message: "Обязательное поле" };
      }
      break;
  }
  return { message: ctx.defaultError };
});

const groupSchema = z.object({
  name: z.string().min(2, "Имя должно быть не короче 2 символов"),
  phone: z
    .string()
    .nonempty("Введите номер телефона")
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length === 11;
    }, "Введите корректный номер телефона"),
  email: z.string().email("Введите корректный email").optional(),
  comment: z.string().min(10, "Опишите ваши пожелания подробнее"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Необходимо согласие на обработку данных" }),
  }),
});

// ---- BookingCalendar ----
const BookingCalendar: React.FC<{
  date: string | undefined;
  onChange: (date: string) => void;
}> = ({ date, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative mb-2" ref={wrapperRef}>
      <label htmlFor="date" className="block mb-2 font-semibold">
        Выберите дату
      </label>

      <button
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
            disabled={(day) =>
              !availableDates.some(
                (available) => available.toDateString() === day.toDateString(),
              )
            }
            locale={ru}
          />
        </div>
      )}
    </div>
  );
};

// ---- BookingForm ----
export default function BookingForm({ price, tourName }: BookingFormProps) {
  const [programType, setProgramType] = useState<ProgramType>("standard");
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      programType === "standard" ? standardSchema : groupSchema,
    ),
    defaultValues:
      programType === "standard"
        ? { people: "1", consent: false }
        : { consent: false },
  });

  const date = watch("date");
  const people = watch("people") || 1;
  const totalPrice = price * people;

  const onSubmit = async (data: any) => {
    try {
      if (programType === "standard") {
        const formattedDate = new Date(data.date).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        await sendMessageToTelegram(
          data.name,
          data.phone,
          data.email || "",
          formattedDate,
          data.people,
          tourName,
        );
      } else {
        await sendGroupRequest(
          data.name,
          data.phone,
          data.email || "",
          data.comment,
          tourName,
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
    <section id="booking" className="py-16 bg-white scroll-mt-16">
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

        {programType === "individual" && (
          <div className="max-w-2xl mx-auto mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 text-blue-700">
              Индивидуальные экскурсии для организованных групп
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Удобную для вас дату и время</li>
              <li>Место подачи автобуса</li>
              <li>Индивидуальную программу экскурсий</li>
              <li>Детскую экскурсию</li>
              <li>Возможность выбрать и добавить к посещению дополнительные объекты 
              </li>
              <li>Для организованных групп от 15 человек*</li>
            </ul>
            <p className="mt-4 text-gray-800">
              Мы разработаем маршрут специально под ваши пожелания! 🚍
            </p>
          </div>
        )}

        {/* Блок с формой */}
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Имя */}
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-semibold">
                Имя
              </label>
              <input
                id="name"
                {...register("name")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Телефон */}
            <div className="mb-4">
              <label htmlFor="phone" className="block mb-2 font-semibold">
                Телефон
              </label>

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
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-semibold">
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Дата и кол-во человек (только для стандартной) */}
            {programType === "standard" && (
              <>
                {/* Дата */}
                <div className="mb-4">
                  <BookingCalendar
                    date={date}
                    onChange={(value) => setValue("date", value)}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                {/* Кол-во человек */}
                <div className="mb-4">
                  <label htmlFor="people" className="block mb-2 font-semibold">
                    Количество человек
                  </label>
                  <input
                    id="people"
                    type="number"
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
                    <p className="text-red-500 text-sm">
                      {errors.people.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Комментарий (только для групповой) */}
            {programType === "individual" && (
              <div className="mb-4">
                <label htmlFor="comment" className="block mb-2 font-semibold">
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  {...register("comment")}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm">
                    {errors.comment.message}
                  </p>
                )}
              </div>
            )}

            {/* Чекбокс согласия */}
            <div className="mb-6">
              <div className="flex items-start space-x-2">
                <input
                  id="consent"
                  type="checkbox"
                  {...register("consent")}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  Я соглашаюсь с{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    политикой конфиденциальности
                  </a>
                  .
                </label>
              </div>
              {errors.consent && (
                <p className="text-red-500 text-sm">{errors.consent.message}</p>
              )}
            </div>

            {/* Кнопка */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
            </button>

            {/* Итоговая стоимость */}
            {programType === "standard" && (
              <div className="mt-6 text-center text-xl font-semibold text-gray-900">
                Итого: {totalPrice.toLocaleString("ru-RU")} ₽
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

// ---- ОТПРАВКА ЗАЯВОК ----
async function sendMessageToTelegram(
  name: string,
  phone: string,
  email: string,
  date: string,
  people: number,
  tourName: string,
) {
  await fetch("https://telegram-proxy-tau.vercel.app/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `
📩 <b>Новая заявка на стандартный тур</b>
👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}
📅 Дата: ${date}
👥 Кол-во человек: ${people}
🚩 Тур: ${tourName}
      `.trim(),
    }),
  });
}

async function sendGroupRequest(
  name: string,
  phone: string,
  email: string,
  comment: string,
  tourName: string,
) {
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
      `.trim(),
    }),
  });
}
