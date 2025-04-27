"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { InputMask } from "@react-input/mask";
import { Controller } from "react-hook-form";

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

// ---- ВАЛИДАЦИЯ через zod ----
const bookingSchema = z.object({
  name: z.string().optional().refine((val) => !val || val.length >= 2, {
    message: "Имя должно быть не короче 2 символов",
  }),
  phone: z.string().nonempty("Введите номер телефона").refine((val) => {
    // Убираем всё кроме цифр
    const digits = val.replace(/\D/g, "");
    return digits.length === 11; // Для России: 11 цифр (+7 и 10 цифр номера)
  }, {
    message: "Введите корректный номер телефона",
  }),
  email: z.string().optional().refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
    message: "Введите корректный email",
  }),
  date: z.string().nonempty("Выберите дату"),
  people: z
    .string()
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1;
    }, {
      message: "Минимум 1 человек",
    }),
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

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  price: number;
  tourName: string;
}

// ---- ОТПРАВКА ----
async function sendMessageToTelegram(
  name: string,
  phone: string,
  email: string,
  date: string,
  people: number,
  tourName: string,
) {
  await fetch("https://your-api.com/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `
  📩 <b>Новая заявка</b>
  👤 Имя: ${name}
  📞 Телефон: ${phone}
  📧 Email: ${email}
  📅 Дата: ${date}
  👥 Кол-во человек: ${people}
  🚩 Тур: ${tourName}
      `.trim()
    }),
  });
}

// ---- BookingCalendar ----
const BookingCalendar: React.FC<{
  date: string | undefined;
  onChange: (date: string) => void;
}> = ({ date, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
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
                (available) => available.toDateString() === day.toDateString()
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
  const [sent, setSent] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      people: "1",
      consent: false,
    },
  });

  const date = watch("date");
  const people = watch("people") || 1;
  const totalPrice = price * people;

  const onSubmit = async (data: BookingFormValues) => {
    try {
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
        tourName
      );

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
        <h2 className="text-3xl font-bold text-center mb-4">Забронируйте место</h2>
        <p className="text-center mb-8">
          После заполнения мы свяжемся с вами и подтвердим вашу бронь
        </p>

        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Имя */}
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-semibold">Имя</label>
              <input
                id="name"
                {...register("name")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Телефон */}
            <div className="mb-4">
              <label htmlFor="phone" className="block mb-2 font-semibold">Телефон</label>

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

                      if (inputType === 'insert' && data && data.length > 1) {
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


              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-semibold">Email</label>
              <input
                id="email"
                {...register("email")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Дата */}
            <div className="mb-4">

              <BookingCalendar
                date={date}
                onChange={(value) => setValue("date", value)}
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>

            {/* Количество человек */}
            <div className="mb-4">
              <label htmlFor="people" className="block mb-2 font-semibold">Количество человек</label>
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

              {errors.people && <p className="text-red-500 text-sm">{errors.people.message}</p>}
            </div>

            {/* Чекбокс согласия */}
            <div className="mb-6">
              <div className="flex items-start space-x-2 ">
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
              {errors.consent && <p className="text-red-500 text-sm">{errors.consent.message}</p>}
            </div>

            {/* Кнопка */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
            >
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
            </button>

            {/* Итоговая стоимость */}
            <div className="mt-6 text-center text-xl font-semibold text-gray-900">
              Итого: {totalPrice.toLocaleString("ru-RU")} ₽
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
