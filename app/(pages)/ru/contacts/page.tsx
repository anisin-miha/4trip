import { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { Link as IntlLink } from "@/i18n/navigation";
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
        url: "https://4-trip.ru/images/tours/patriot/cathedral-hero.png",
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
  const { phone, email, address, social, links, performer, site } = contactInfo;
  const phoneHref = `tel:${phone.replace(/\s|\(|\)|-/g, "")}`;

  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <SiteHeader
        title="Контакты"
        main
        project="trip"
        links={[
          { href: "/ru", label: "Главная" },
          // { href: "/ru/excursions", label: "Экскурсии" },
          { href: "/ru/blog", label: "Блог" },
          { href: "/ru/contacts", label: "Контакты" },
        ]}
      />

      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        <h1 className="text-4xl font-bold text-center mb-12">Свяжитесь с нами</h1>

        <div className="max-w-2xl mx-auto space-y-8 text-lg text-gray-800">
          <section className="space-y-4">
            <p>Мы всегда рады ответить на ваши вопросы и помочь с выбором экскурсии.</p>
            <p>
              <strong>Телефон:</strong>{" "}
              <a href={phoneHref} className="text-blue-600 hover:underline">
                {phone}
              </a>
            </p>
            {email && (
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                  {email}
                </a>
              </p>
            )}
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
              {links.seryoga_tg && (
                <>
                  {" "}
                  <span className="text-gray-500">·</span>{" "}
                  <a
                    href={links.seryoga_tg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    связаться с Сергеем
                  </a>
                </>
              )}
            </p>
            {address && (
              <p>
                <strong>Адрес:</strong> {address}
              </p>
            )}
          </section>

          <section className="space-y-2 text-base text-gray-700">
            <h2 className="text-2xl font-semibold mb-2">Реквизиты исполнителя</h2>
            <p>ФИО: {performer.fullName}</p>
            <p>ИНН: {performer.inn} (самозанятый, НПД)</p>
          </section>
        </div>
      </main>

      <SiteFooter project="trip" contacts={{ phone: contactInfo.phone, email: contactInfo.email, social: contactInfo.social }} />
    </div>
  );
}
