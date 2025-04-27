import { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TourCard from "../components/TourCard";

export const metadata: Metadata = {
  title: "Экскурсии по Подмосковью — групповые туры от 4-trip.ru",
  description:
    "Групповые экскурсии по Подмосковью от 4-trip.ru: Парк «Патриот», Сергиев Посад и другие направления. Комфортные поездки с профессиональными гидами!",
  openGraph: {
    title: "Экскурсии по Подмосковью — 4-trip.ru",
    description:
      "Групповые туры по Подмосковью от 4-trip.ru: увлекательные маршруты, профессиональные гиды, комфортные поездки.",
    url: "https://4-trip.ru/",
    type: "website",
    images: [
      {
        url: "https://4-trip.ru/images/cover.png",
        width: 1200,
        height: 630,
        alt: "Экскурсии 4-trip.ru",
      },
    ],
  },
  alternates: {
    canonical: "https://4-trip.ru/",
  },
};

export default function Home() {
  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth">
      <Header
        title=""
        main
        links={[
          { href: "/", label: "Главная" },
          { href: "/blog", label: "Блог" },
          { href: "/contacts", label: "Контакты" },
        ]}
      />

      <main className="py-16">
        <section className="container mx-auto px-4 mb-16 mt-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Групповые экскурсии по Подмосковью
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Организуем комфортные групповые туры в Парк «Патриот», Сергиев Посад и другие интересные места.
          </p>
          <p className="max-w-2xl mx-auto text-gray-700">
            Мы предлагаем увлекательные маршруты с опытными гидами. Наш транспорт обеспечит удобство в пути, а насыщенные программы сделают ваши поездки запоминающимися!
          </p>
        </section>

        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Популярные экскурсии
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <TourCard
              href="/patriot"
              imageSrc="/images/patriot/pencil.png"
              imageAlt="Парк «Патриот»"
              title="Экскурсия в Парк «Патриот»"
              description="Посещение Главного храма Вооруженных Сил России и музея «Дорога памяти» в рамках группового тура."
            />
            <TourCard
              href="/sergiev-posad"
              imageSrc="/images/sergiev_posad/pencil.png"
              imageAlt="Сергиев Посад"
              title="Экскурсия в Сергиев Посад"
              description="Поездка в духовную столицу России с экскурсией по Троице-Сергиевой лавре."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
