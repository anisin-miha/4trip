"use client";

import { useState } from "react";
import { toast } from "sonner";
import React from "react";

interface BookingFormProps {
  price: number;
  tourName: string;
}

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
    body: JSON.stringify({ name, phone, email, date, people, tourName }),
  });
}

const BookingFormContent: React.FC<{
  name: string;
  phone: string;
  email: string;
  date: string;
  people: number;
  consent: boolean;
  loading: boolean;
  price: number;
  onChange: (field: string, value: string | number | boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}> = ({
  name,
  phone,
  email,
  date,
  people,
  consent,
  loading,
  price,
  onChange,
  onSubmit,
}) => (
    <>

      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 font-semibold">
            Имя
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block mb-2 font-semibold">
            Телефон
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => onChange("phone", e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block mb-2 font-semibold">
            Выберите дату
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="people" className="block mb-2 font-semibold">
            Количество человек
          </label>
          <input
            type="number"
            id="people"
            value={people}
            onChange={(e) => onChange("people", parseInt(e.target.value))}
            min={1}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Стоимость тура */}
        <div className="mb-6 text-center text-xl font-semibold text-gray-900">
          Стоимость тура: {price.toLocaleString("ru-RU")} ₽
        </div>

        {/* Чекбокс согласия */}
        <div className="flex items-start space-x-2 mb-6">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => onChange("consent", e.target.checked)}
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

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
        >
          {loading ? "Отправка..." : "Отправить заявку"}
        </button>
      </form>
    </>
  );

const BookingFormSuccess: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="text-center space-y-6">
    <p className="text-xl font-semibold text-green-700">
      ✅ Заявка отправлена!
    </p>
    <p className="text-gray-600">Мы свяжемся с вами в ближайшее время.</p>
    <button
      onClick={onReset}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
    >
      Отправить ещё одну заявку
    </button>
  </div>
);

const BookingForm: React.FC<BookingFormProps> = ({ price, tourName }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(1);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!consent) {
      toast("Пожалуйста, подтвердите согласие на обработку персональных данных.");
      return;
    }

    setLoading(true);

    const formattedDate = new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    try {
      await sendMessageToTelegram(name, phone, email, formattedDate, people, tourName);
      setSent(true);
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      toast.error("Ошибка при отправке. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSent(false);
    setName("");
    setPhone("");
    setEmail("");
    setDate("");
    setPeople(1);
    setConsent(false);
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    switch (field) {
      case "name":
        setName(value as string);
        break;
      case "phone":
        setPhone(value as string);
        break;
      case "email":
        setEmail(value as string);
        break;
      case "date":
        setDate(value as string);
        break;
      case "people":
        setPeople(value as number);
        break;
      case "consent":
        setConsent(value as boolean);
        break;
    }
  };

  return (
    <section id="booking" className="py-16 bg-white scroll-mt-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Забронируйте место
        </h2>
        <p className="text-center mb-8">
          После заполнения мы свяжемся с вами и подтвердим бронь
        </p>

        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          {!sent ? (
            <BookingFormContent
              name={name}
              phone={phone}
              email={email}
              date={date}
              people={people}
              consent={consent}
              loading={loading}
              price={price}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          ) : (
            <BookingFormSuccess onReset={resetForm} />
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
