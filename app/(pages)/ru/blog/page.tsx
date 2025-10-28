import { Metadata } from "next";
import SiteHeader from "@/app/components/ru/SiteHeader";
import SiteFooter from "@/app/components/ru/SiteFooter";
import contactInfo from "@/app/config/contactInfo";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title:
    "Блог о путешествиях и экскурсиях – советы и идеи от 4-trip.ru",
  description:
    "Статьи о лучших экскурсиях по Москве и Подмосковью, советы путешественникам и идеи для туров выходного дня. Читайте блог 4-trip.ru и планируйте путешествия!",
  openGraph: {
    title:
      "Блог о путешествиях и экскурсиях – советы и идеи от 4-trip.ru",
    description:
      "Статьи о лучших экскурсиях по Москве и Подмосковью, советы путешественникам и идеи для туров выходного дня. Читайте блог 4-trip.ru и планируйте путешествия!",
    url: "https://4-trip.ru/ru/blog",
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
    canonical: "https://4-trip.ru/ru/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <SiteHeader
        title="Блог"
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
        <h1 className="text-4xl font-bold text-center mb-12">
          Блог об экскурсиях и путешествиях
        </h1>
        <div className="grid md:grid-cols-2 gap-10">
          <Link
            href="/blog/park-patriot-chto-posmotret"
            aria-label="Что посмотреть в Парке Патриот: обзор всех экспозиций"
            className="group block border p-6 rounded-lg shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h2 className="text-2xl font-semibold mb-3 group-hover:underline">
              Что посмотреть в Парке «Патриот»: обзор всех экспозиций
            </h2>
            <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 mb-4 max-w-full break-words">
              <span>⚡️ Интерактив внутри статьи:</span>
              <span>соберите план на день</span>
            </div>
            <p className="text-gray-600 mb-4">
              Рассказываем, почему это место стоит посетить хотя бы раз: от
              главного храма до интерактивной военной техники.
            </p>
            <span className="text-blue-600 hover:underline">
              Читать далее →
            </span>
          </Link>
        </div>
      </main>

      <SiteFooter
        project="trip"
        contacts={{
          phone: contactInfo.phone,
          email: contactInfo.email,
          social: contactInfo.social,
        }}
      />
    </div>
  );
}
