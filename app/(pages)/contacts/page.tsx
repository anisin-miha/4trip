import { Metadata } from "next";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import contactInfo from "@/app/config/contactInfo";

export const metadata: Metadata = {
  title: "Контакты — 4-trip.ru",
  description:
    "Свяжитесь с командой 4-trip.ru: телефон, email, Telegram и ВКонтакте. Поможем выбрать экскурсию и ответим на все вопросы.",
  openGraph: {
    title: "Контакты — 4-trip.ru",
    description:
      "Актуальные контакты команды 4-trip.ru: телефоны, мессенджеры и социальные сети для связи по вопросам экскурсий.",
    url: "https://4-trip.ru/contacts",
    type: "website",
    images: [
      {
        url: "https://4-trip.ru/images/cover.png",
        width: 1200,
        height: 630,
        alt: "4-trip.ru",
      },
    ],
  },
  alternates: {
    canonical: "https://4-trip.ru/contacts",
  },
};

export default function ContactsPage() {
  const { phone, email, social } = contactInfo;

  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <Header
        title="Контакты"
        main
        links={[
          { href: "/", label: "Главная" },
          { href: "/blog", label: "Блог" },
          { href: "/contacts", label: "Контакты" },
        ]}
      />

      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        <h1 className="text-4xl font-bold text-center mb-12">
          Свяжитесь с нами
        </h1>

        <div className="max-w-xl mx-auto space-y-6 text-lg text-gray-800">
          <p>
            Мы всегда рады ответить на ваши вопросы и помочь с выбором
            экскурсии.
          </p>
          <p>
            <strong>Телефон:</strong>{" "}
            <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
              {phone}
            </a>
          </p>
          <p>
            <strong>Telegram:</strong>{" "}
            <a
              href={social.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              написать в Telegram
            </a>
          </p>
          <p>
            <strong>ВКонтакте:</strong>{" "}
            <a
              href={social.vk}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              наша страница
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
