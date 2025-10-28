import { Metadata } from "next";
import SiteHeader from "@/app/components/ru/SiteHeader";
import SiteFooter from "@/app/components/ru/SiteFooter";
import contactInfo from "@/app/config/contactInfo";
import HomePage from "@/app/components/ru/HomePage";

export const metadata: Metadata = {
  title: "Экскурсии по Москве и Подмосковью — групповые автобусные туры от 4-trip.ru",
  description:
    "Групповые экскурсии по Москве и Подмосковью от 4-trip: обзорная по столице, Парк «Патриот», Сергиев Посад, Коломна и другие маршруты с профессиональными гидами.",
  openGraph: {
    title: "Экскурсии по Москве и Подмосковью — 4-trip.ru",
    description:
      "Групповые туры по Москве и Подмосковью: обзорная по столице, Парк «Патриот», Сергиев Посад и другие направления.",
    url: "https://4-trip.ru/",
    type: "website",
    images: [
      {
        url: "https://4-trip.ru/images/tours/patriot/cathedral-hero.png",
        width: 1200,
        height: 630,
        alt: "Экскурсии 4-trip.ru",
      },
    ],
  },
  alternates: {
    canonical: "/",
    languages: {
      ru: "/",
    },
  },
};

export default function Home() {
  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth">
      <SiteHeader
        title=""
        main
        project="trip"
        links={[
          { href: "/ru", label: "Главная" },
          // { href: "/ru/excursions", label: "Экскурсии" },
          { href: "/ru/blog", label: "Блог" },
          { href: "/ru/contacts", label: "Контакты" },
        ]}
      />

      <HomePage />

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
