import { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import contactInfo from "@/app/config/contactInfo";
import TourCard from "../../components/TourCard";
import { patriotTour } from "../../config/tours/patriot";
import { sergievPosadTour } from "../../config/tours/sergiev-posad";
import { kolomnaTour } from "../../config/tours/kolomna";
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
        url: "https://4-trip.ru/images/patriot/cathedral-hero.png",
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
  const pickInfo = (arr: { label: string; value: string }[], label: string) =>
    arr.find((i) => i.label === label)?.value;

  const patriotDuration = pickInfo(
    patriotTour.meetingPoint.info,
    "Длительность"
  );
  const patriotLang = pickInfo(
    patriotTour.meetingPoint.info,
    "Язык экскурсии"
  );
  const patriotMeeting = pickInfo(
    patriotTour.meetingPoint.info,
    "Место встречи"
  );
  const patriotCity = patriotTour.city;

  const spDuration = pickInfo(
    sergievPosadTour.meetingPoint.info,
    "Длительность"
  );
  const spLang = pickInfo(
    sergievPosadTour.meetingPoint.info,
    "Язык экскурсии"
  );
  const spMeeting = pickInfo(
    sergievPosadTour.meetingPoint.info,
    "Место встречи"
  );
  const spCity = sergievPosadTour.city;
  const kolDuration = pickInfo(
    kolomnaTour.meetingPoint.info,
    "Длительность"
  );
  const kolLang = pickInfo(
    kolomnaTour.meetingPoint.info,
    "Язык экскурсии"
  );
  const kolMeeting = pickInfo(
    kolomnaTour.meetingPoint.info,
    "Место встречи"
  );
  const kolCity = kolomnaTour.city;
  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth">
      <SiteHeader
        title=""
        main
        project="trip"
        links={[
          { href: "/ru", label: "Главная" },
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
          <div className="grid md:grid-cols-3 gap-8">
          <TourCard
            href="/patriot"
            imageSrc="/images/patriot/pencil.png"
            imageAlt="Парк «Патриот»"
            title={`Экскурсия в ${ruAccusativeAfterV(patriotTour.title)}`}
            description="Посещение Главного храма Вооружённых Сил России и музея «Дорога памяти» в рамках группового тура."
            price={patriotTour.price}
            duration={patriotDuration}
            languages={patriotLang ? [patriotLang] : undefined}
            city={patriotCity}
            meetingPoint={patriotMeeting}
          />
          <TourCard
            href="/sergiev-posad"
            imageSrc="/images/sergiev_posad/pencil.png"
            imageAlt="Сергиев Посад"
            title={`Экскурсия в ${ruAccusativeAfterV(sergievPosadTour.title)}`}
            description="Поездка в духовную столицу России с экскурсией по Троице-Сергиевой лавре."
            price={sergievPosadTour.price}
            duration={spDuration}
            languages={spLang ? [spLang] : undefined}
            city={spCity}
            meetingPoint={spMeeting}
          />
          <TourCard
            href="/kolomna"
            imageSrc="/images/kolomna/hero.png"
            imageAlt="Коломна"
            title={`Экскурсия в ${ruAccusativeAfterV(kolomnaTour.title)}`}
            description={kolomnaTour.hero.description}
            price={kolomnaTour.price}
            duration={kolDuration}
            languages={kolLang ? [kolLang] : undefined}
            city={kolCity}
            meetingPoint={kolMeeting}
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
