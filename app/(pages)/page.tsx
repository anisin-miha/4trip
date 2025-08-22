import { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TourCard from "../components/TourCard";

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
            Откройте для себя Подмосковье по-новому — живописные маршруты,
            исторические места и атмосфера настоящего путешествия ждут вас!
          </p>
          <p className="max-w-2xl mx-auto text-gray-700">
            Каждая наша экскурсия — это возможность вдохновиться культурой,
            историей и природой родного края. Незабываемые эмоции, новые
            знакомства и удивительные открытия начинаются здесь.
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
              description="Посещение Главного храма Вооружённых Сил России и музея «Дорога памяти» в рамках группового тура."
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

      <Footer />
    </div>
  );
}
