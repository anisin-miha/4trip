import { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import contactInfo from "@/app/config/contactInfo";
import TourCard from "@/app/components/TourCard";
import { patriotTour } from "@/app/config/tours/patriot";
import { sergievPosadTour } from "@/app/config/tours/sergiev-posad";
import { kolomnaTour } from "@/app/config/tours/kolomna";
import { moscowSightseeingCard } from "@/app/config/tours/moscow-sightseeing";
import { ruAccusativeAfterV } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Экскурсии по Подмосковью — групповые туры от 4-trip.ru",
  description:
    "Групповые экскурсии по Подмосковью от 4-trip.ru: Парк «Патриот», Сергиев Посад и другие маршруты с профессиональными гидами.",
  openGraph: {
    title: "Экскурсии по Подмосковью — 4-trip.ru",
    description:
      "Групповые туры по Подмосковью от 4-trip.ru: увлекательные маршруты, профессиональные гиды, комфортные поездки.",
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
    canonical: "https://4-trip.ru/",
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

      <main className="py-16">
        <section className="container mx-auto px-4 mb-16 mt-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Групповые экскурсии по Подмосковью
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Откройте для себя Подмосковье по-новому — живописные маршруты,
            исторические места и атмосфера настоящего путешествия ждут вас!
          </p>
          <p className="max-w-2xl mx-auto text-gray-700">
            Каждая наша экскурсия — это возможность вдохновиться культурой,
            историей и природой родного края. Незабываемые эмоции, новые
            знакомства и удивительные открытия начинаются здесь.
          </p>
        </section>

        <section className="mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Популярные экскурсии
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <TourCard
            href="/excursions/patriot"
            imageSrc="/images/tours/patriot/cathedral-hero.png"
            imageAlt="Парк «Патриот»"
            title={`Экскурсия в ${ruAccusativeAfterV(patriotTour.title)}`}
            description="Посещение Главного храма Вооружённых Сил России и музея «Дорога памяти» в рамках группового тура."
            price={patriotTour.price}
            duration={patriotTour.duration}
            languages={patriotTour.languages}
            city={patriotTour.city}
            meetingPoint={patriotTour.meetingPoint.address}
          />
          <TourCard
            href="/excursions/sergiev-posad"
            imageSrc="/images/tours/sergiev_posad/hero.png"
            imageAlt="Сергиев Посад"
            title={`Экскурсия в ${ruAccusativeAfterV(sergievPosadTour.title)}`}
            description="Поездка в духовную столицу России с экскурсией по Троице-Сергиевой лавре."
            price={sergievPosadTour.price}
            duration={sergievPosadTour.duration}
            languages={sergievPosadTour.languages}
            city={sergievPosadTour.city}
            meetingPoint={sergievPosadTour.meetingPoint.address}
          />
          <TourCard
            href="/excursions/kolomna"
            imageSrc="/images/tours/kolomna/hero.png"
            imageAlt="Коломна"
            title={`Экскурсия в ${ruAccusativeAfterV(kolomnaTour.title)}`}
            description={kolomnaTour.hero.description}
            price={kolomnaTour.price}
            duration={kolomnaTour.duration}
            languages={kolomnaTour.languages}
            city={kolomnaTour.city}
            meetingPoint={kolomnaTour.meetingPoint.address}
          />
          <TourCard
            href={moscowSightseeingCard.href}
            imageSrc={moscowSightseeingCard.imageSrc}
            imageAlt={moscowSightseeingCard.imageAlt}
            title={moscowSightseeingCard.title}
            description={moscowSightseeingCard.description}
            price={moscowSightseeingCard.price}
            duration={moscowSightseeingCard.duration}
            languages={moscowSightseeingCard.languages}
            city={moscowSightseeingCard.city}
            meetingPoint={moscowSightseeingCard.meetingPoint}
            rating={moscowSightseeingCard.rating}
          />
          </div>
        </section>

        <section className="container mx-auto px-4 mb-16 mt-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            Почему выбирают 4-trip.ru
          </h2>
          <div className="max-w-3xl mx-auto text-gray-700 space-y-6 text-lg leading-relaxed">
            <p>
              Мы заботимся о каждой детали, чтобы ваше путешествие было
              действительно комфортным. Современные автобусы, удобные маршруты и
              поддержка на каждом этапе — стандарт для всех наших экскурсий по
              Подмосковью.
            </p>
            <p>
              Парк «Патриот», Сергиев Посад и другие направления — тщательно
              проработанные программы с посещением ключевых
              достопримечательностей. Всё для того, чтобы вы получили максимум
              впечатлений без лишней спешки и суеты.
            </p>
            <p>
              Опытные гиды, которые умеют интересно и доступно рассказать об
              истории и культуре, сопровождают вас на протяжении всего тура,
              превращая поездку в настоящее приключение.
            </p>
            <p>
              Присоединяйтесь к путешествиям с 4-trip.ru — мы знаем, как
              превратить экскурсию в незабываемое событие!
            </p>
          </div>
        </section>
      </main>

      <SiteFooter project="trip" contacts={{ phone: contactInfo.phone, email: contactInfo.email, social: contactInfo.social }} />
    </div>
  );
}
