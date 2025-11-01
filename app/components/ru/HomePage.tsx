import TourCard from "@/app/components/ru/TourCard";
import { excursions } from "@/app/config/ru/tours";

export default function HomePage() {
  return (
    <main className="py-16">
      <section className="container mx-auto px-4 mb-16 mt-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Групповые экскурсии по Москве и Подмосковью
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Откройте для себя лучшие места Москвы и Подмосковья вместе с нами – живописные маршруты, знаковые достопримечательности и атмосфера настоящего приключения уже ждут вас! Мы предлагаем автобусные экскурсии выходного дня из Москвы для всех, кто хочет узнать новое и ярко провести время.
        </p>
        <p className="max-w-2xl mx-auto text-gray-700">
          Каждая экскурсия 4-trip.ru – это возможность вдохновиться культурой столицы и области, прикоснуться к истории и насладиться красотой родных мест. Вас ждут незабываемые эмоции, новые знакомства и открытия. От обзорной экскурсии по Москве до однодневных туров в Подмосковье – путешествия начинаются здесь.
        </p>
      </section>

      <section className="mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Популярные экскурсии
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {excursions
            .filter((tour) => tour.visibility)
            .map((tour) => {
              return {
                href: `/excursions/${tour.slug}`,
                imageSrc: tour.hero.image,
                imageAlt: tour.title,
                title: tour.title,
                description: tour.hero.description,
                price: tour.price,
                duration: tour.duration,
                languages: tour.languages,
                city: tour.city,
                meetingPoint: tour.meetingPoint?.address,
                rating: tour.rating,
                badges: tour.badges,
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
                rating={card.rating ?? undefined}
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
            Мы продумываем каждую деталь, чтобы ваше путешествие прошло комфортно и безопасно. <strong>Современные автобусы</strong>, <strong>удобные маршруты</strong> и поддержка на каждом этапе – стандарт для всех наших туров по Москве и Подмосковью. Вы можете не беспокоиться о мелочах и полностью погрузиться в впечатления.
          </p>
          <p>
            <strong>Лучшие маршруты.</strong> Парк «Патриот», Сергиев Посад, Коломна и другие направления – тщательно продуманные программы с посещением главных достопримечательностей. Никакой суеты: достаточно времени, чтобы увидеть важное без спешки и усталости.
          </p>
          <p>
            <strong>Опытные гиды.</strong> Наши гиды – истинные знатоки и увлечённые рассказчики. Они интересно и доступно поделятся историями и фактами, превращая поездку в увлекательное путешествие. Вы узнаете город и окрестности с новой стороны и получите ответы на любые вопросы.
          </p>
          <p>
            Присоединяйтесь к путешествиям с <strong>4-trip.ru</strong> – мы знаем, как сделать каждую экскурсию незабываемой! Забронировать место легко онлайн, и уже в ближайшие выходные вы сможете отправиться за новыми впечатлениями.
          </p>
        </div>
      </section>
    </main>
  );
}
