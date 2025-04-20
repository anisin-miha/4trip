import Link from "next/link";

import BaseImage from "@/components/BaseImage";
import Header from "@/app/components/Header";
import BookingForm from "@/app/components/BookingForm";
import Footer from "@/app/components/Footer";

export default function SergievPosad() {
  return (
    <div className="font-sans bg-gray-100 scroll-smooth">
      <Header title="Сергиев Посад Тур"  />

      <main>
        <section
          id="hero"
          className="relative h-screen flex items-center scroll-mt-16"
        >
          <BaseImage
            src="/images/sergiev_posad/hero.png"
            alt="Панорама Троице-Сергиевой лавры"
            fill
            priority
            className="object-cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />

          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4">
              <div className="max-w-md text-white text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Экскурсия в&nbsp;Сергиев Посад
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-100">
                  Откройте для себя духовный центр России и
                  прикоснитесь к&nbsp;великим традициям русского монашества
                </p>
                <Link
                  href="#booking"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-semibold inline-block"
                >
                  Забронировать место
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="attractions" className="py-16 bg-gray-100 scroll-mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Что вы увидите на экскурсии
            </h2>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <BaseImage
                  src="/images/sergiev_posad/Trinity-Lavra-of-St.-Sergius.png"
                  alt="Интерьер Троице-Сергиевой лавры"
                  width={600}
                  height={600}
                  className="w-full h-128 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Троице-Сергиева лавра
                  </h3>
                  <p>
                    Главная святыня города, основанная преподобным Сергием
                    Радонежским в&nbsp;14 веке. Подлинные фрески Андрея
                    Рублева, древние колокола и&nbsp;духовная атмосфера.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <BaseImage
                  src="/images/sergiev_posad/Porcelain-Factory-and-Museum.png"
                  alt="Музей фарфора"
                  width={600}
                  height={600}
                  className="w-full h-128 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Фарфоровый завод и&nbsp;музей
                  </h3>
                  <p>
                    Посетим легендарный завод Императорского фарфора, узнаем
                    о процессе создания изящных сервизов и&nbsp;посмотрим
                    коллекции 18–20 веков.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                Вы узнаете:
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>историю основания Лавры;</li>
                <li>секреты древней росписи Андрея Рублева;</li>
                <li>процесс производства фарфора;</li>
                <li>роль Сергия Радонежского в&nbsp;русской истории;</li>
                <li>какие легенды окружают монастырь;</li>
                <li>современную жизнь монахов и&nbsp;традиции.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-16 bg-white scroll-mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Отзывы участников
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <p className="mb-4 italic">
                  «Невероятно душевно и познавательно. Лавра произвела
                  глубокое впечатление.»
                </p>
                <p className="font-bold">— Анна, Ярославль</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <p className="mb-4 italic">
                  «Замечательный гид, интересные факты и красивая
                  архитектура.»
                </p>
                <p className="font-bold">— Дмитрий, Москва</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <p className="mb-4 italic">
                  «Отличная организация, комфортный транспорт и отличная
                  компания.»
                </p>
                <p className="font-bold">— Ольга, Санкт-Петербург</p>
              </div>
            </div>
          </div>
        </section>

        <section id="meeting" className="py-16 bg-gray-100 scroll-mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Место встречи и маршрут
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=38.126953,56.315941&z=14&pt=38.126953,56.315941,pm2rdm"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Место встречи в Сергиевом Посаде"
                />
              </div>

              <div className="p-6 rounded-lg">
                <ul className="space-y-4 text-gray-800">
                  <li>
                    <span className="font-semibold">Тип экскурсии:</span>{" "}
                    Групповая сборная
                  </li>
                  <li>
                    <span className="font-semibold">Время начала:</span> 09:00
                  </li>
                  <li>
                    <span className="font-semibold">Длительность:</span> около 8 ч.
                  </li>
                  <li>
                    <span className="font-semibold">Место встречи:</span>{" "}
                    Москва, метро "Комсомольская", выход к Ленинградскому вокзалу
                  </li>
                  <li>
                    <span className="font-semibold">Размер группы:</span> До 30 человек
                  </li>
                  <li>
                    <span className="font-semibold">Для кого:</span> Можно с детьми
                  </li>
                  <li>
                    <span className="font-semibold">Язык экскурсии:</span> русский
                  </li>
                  <li>
                    <span className="font-semibold">Стоимость:</span> 3 000 ₽ с человека
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="booking" className="py-16 bg-white scroll-mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Забронируйте экскурсию
            </h2>
            <p className="text-center mb-8">
              Оставьте заявку, и мы свяжемся с вами для подтверждения места.
            </p>
            <BookingForm />
          </div>
        </section>

        <section id="gallery" className="py-16 bg-gray-100 scroll-mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Фотогалерея
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <BaseImage
                src="/images/sergiev_posad/gallery1.png"
                alt="Галерея 1 Сергеев Посад"
                width={300}
                height={200}
                className="w-full h-64 object-cover rounded-lg"
              />
              <BaseImage
                src="/images/sergiev_posad/gallery2.png"
                alt="Галерея 2 Сергиев Посад"
                width={300}
                height={200}
                className="w-full h-64 object-cover rounded-lg"
              />
              <BaseImage
                src="/images/sergiev_posad/gallery3.png"
                alt="Галерея 3 Сергиев Посад"
                width={300}
                height={200}
                className="w-full h-64 object-cover rounded-lg"
              />
              <BaseImage
                src="/images/sergiev_posad/gallery4.png"
                alt="Галерея 4 Сергиев Посад"
                width={300}
                height={200}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

        <section id="faq" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Часто задаваемые вопросы
            </h2>
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Сколько длится экскурсия?
                </h3>
                <p>
                  Экскурсия длится примерно 8 часов, включая переезд.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Включен ли трансфер?
                </h3>
                <p>
                  Да, автобус от метро "Комсомольская" до Сергиева Посада
                  и обратно включен.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Можно ли взять с собой детей?
                </h3>
                <p>
                  Экскурсия подходит для всей семьи, дети от 7 лет в
                  сопровождении взрослых.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
