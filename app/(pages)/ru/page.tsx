import { Metadata } from "next";
import SiteHeader from "@/app/components/ru/SiteHeader";
import SiteFooter from "@/app/components/ru/SiteFooter";
import contactInfo from "@/app/config/contactInfo";
import TourCard from "@/app/components/ru/TourCard";
import { excursions } from "@/app/config/ru/tours";

export const metadata: Metadata = {
  title: "Экскурсии по Москве и Подмосковью — групповые туры от 4-trip.ru",
  description:
    "Групповые экскурсии по Москве и Подмосковью от 4-trip.ru: обзорная по столице, Парк «Патриот», Сергиев Посад и другие маршруты с профессиональными гидами.",
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
          { href: "/", label: "Главная" },
          // { href: "/excursions", label: "Экскурсии" },
          { href: "/blog", label: "Блог" },
          { href: "/contacts", label: "Контакты" },
        ]}
      />

      <main className="py-16">
        <section className="container mx-auto px-4 mb-16 mt-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Групповые экскурсии по Москве и Подмосковью
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Откройте для себя Москву и Подмосковье — живописные маршруты,
            исторические места и атмосфера настоящего путешествия ждут вас!
          </p>
          <p className="max-w-2xl mx-auto text-gray-700">
            Каждая наша экскурсия — это возможность вдохновиться культурой
            столицы и Подмосковья, их историей и природой. Незабываемые эмоции,
            новые знакомства и открытия начинаются здесь.
          </p>
        </section>

        <section className="mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Популярные экскурсии
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {excursions
              .map((tour) => {
                const languages =
                  tour.languages ??
                  (tour.meetingPoint?.language
                    ? [tour.meetingPoint.language]
                    : undefined);
                return {
                  href: `/excursions/${tour.slug}`,
                  imageSrc: tour.hero.image,
                  imageAlt: tour.title,
                  title: tour.title,
                  description: tour.hero.description,
                  price: tour.price,
                  duration: tour.duration ?? tour.meetingPoint?.duration,
                  languages,
                  city: tour.city,
                  meetingPoint: tour.meetingPoint?.address,
                  rating: tour.rating,
                  badges: tour.hero.badges,
                };
              })
              .map((card) => (
                <TourCard
                  key={card.href}
                  href={card.href}
                  imageSrc={card.imageSrc}
                  imageAlt={card.imageAlt}
                  title={card.title}
                  description={card.description}
                  price={card.price}
                  duration={card.duration}
                  languages={card.languages}
                  city={card.city}
                  meetingPoint={card.meetingPoint}
                  rating={card.rating}
                  badges={card.badges}
                />
              ))}
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
              Москве и Подмосковью.
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
