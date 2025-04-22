import Header from "../components/Header";
import Footer from "../components/Footer";
import TourCard from "../components/TourCard";
import BookingForm from "../components/BookingForm";

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
            Ваш путь к увлекательным поездкам
          </h1>
          <p className="text-xl text-gray-600">
            Организуем групповые туры по Подмосковью и не только
          </p>
        </section>

        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Наши экскурсии
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <TourCard
              href="/patriot"
              imageSrc="/images/patriot/pencil.png"
              imageAlt="Парк «Патриот»"
              title="Парк «Патриот»"
              description="Экскурсия к Главному храму Вооруженных Сил России и музею «Дорога памяти»"
            />
            <TourCard
              href="/sergiev-posad"
              imageSrc="/images/sergiev_posad/pencil.png"
              imageAlt="Сергиев Посад"
              title="Сергиев Посад"
              description="Поездка в духовную столицу России с посещением Троице-Сергиевой лавры"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
