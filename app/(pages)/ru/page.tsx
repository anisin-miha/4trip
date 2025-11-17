import { Metadata } from "next";
import SiteHeader from "@/app/components/ru/SiteHeader";
import SiteFooter from "@/app/components/ru/SiteFooter";
import contactInfo from "@/app/config/contactInfo";
import HomePage from "@/app/components/ru/HomePage";
import { composeMetaDescription, composeMetaTitle } from "@/lib/seo/meta";

const HOME_META_TITLE = composeMetaTitle("Экскурсионные туры по Москве и Подмосковью");
const HOME_META_DESCRIPTION = composeMetaDescription(
  "Групповые и индивидуальные экскурсии по Москве и Подмосковью. Удобное расписание туров, опытные гиды и онлайн-бронирование на 4-trip.ru.",
);

export const metadata: Metadata = {
  title: HOME_META_TITLE,
  description: HOME_META_DESCRIPTION,
  openGraph: {
    title: HOME_META_TITLE,
    description: HOME_META_DESCRIPTION,
    url: "https://4-trip.ru/ru/",
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
    canonical: "https://4-trip.ru/ru/",
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
          { href: "/", label: "Главная" },
          // { href: "/excursions", label: "Экскурсии" },
          { href: "/blog", label: "Блог" },
          { href: "/contacts", label: "Контакты" },
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
