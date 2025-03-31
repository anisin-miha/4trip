import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Экскурсия в Парк Патриот | Путешествия на автобусе в Москву" },
    {
      name: "description",
      content:
        "Присоединяйтесь к уникальной экскурсии на автобусе в Парк Патриот. Посетите музей Дорога памяти, храм Вооруженных сил, смотровую площадку и насладитесь полевой кухней. Забронируйте тур по субботам!",
    },
    {
      name: "keywords",
      content:
        "экскурсия Парк Патриот, тур Парк Патриот, экскурсия на автобусе, музей Дорога памяти, храм Вооруженных сил, полевая кухня, экскурсия из Москвы, исторический тур, семейная экскурсия",
    },
    {
      property: "og:title",
      content: "Экскурсия в Парк Патриот | Путешествия на автобусе в Москву",
    },
    {
      property: "og:description",
      content:
        "Присоединяйтесь к уникальной экскурсии на автобусе в Парк Патриот. Посетите музей Дорога памяти, храм Вооруженных сил, смотровую площадку и насладитесь полевой кухней. Забронируйте тур по субботам!",
    },
    { property: "og:image", content: "/images/park-patriot.jpg" },
    { property: "og:url", content: "https://patriot-tour.ru" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Экскурсия в Парк Патриот | Путешествия на автобусе в Москву",
    },
    {
      name: "twitter:description",
      content:
        "Присоединяйтесь к уникальной экскурсии на автобусе в Парк Патриот. Посетите музей Дорога памяти, храм Вооруженных сил, смотровую площадку и насладитесь полевой кухней. Забронируйте тур по субботам!",
    },
    { name: "twitter:image", content: "/images/park-patriot.jpg" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <nav className="container mx-auto px-4 py-4">
          <ul className="flex justify-center space-x-6">
            <li>
              <a href="#hero" className="text-gray-800 hover:text-blue-600">
                Главная
              </a>
            </li>
            <li>
              <a href="#usp" className="text-gray-800 hover:text-blue-600">
                Почему выбирают нас?
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className="text-gray-800 hover:text-blue-600"
              >
                Отзывы
              </a>
            </li>
            <li>
              <a href="#booking" className="text-gray-800 hover:text-blue-600">
                Заявка
              </a>
            </li>
            <li>
              <a href="#gallery" className="text-gray-800 hover:text-blue-600">
                Галерея
              </a>
            </li>
            <li>
              <a href="#faq" className="text-gray-800 hover:text-blue-600">
                FAQ
              </a>
            </li>
            <li>
              <a href="#footer" className="text-gray-800 hover:text-blue-600">
                Контакты
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
        <section
          id="hero"
          className="h-screen snap-start flex items-center justify-center bg-gray-100"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Экскурсия в Парк Патриот
            </h1>
            <p className="text-xl mb-8">
              Откройте для себя уникальный исторический тур по субботам!
            </p>
            <Link
              to="#booking"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Забронировать место
            </Link>
          </div>
        </section>

        <section
          id="usp"
          className="h-screen snap-start flex items-center justify-center bg-white"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Почему выбирают нас?
            </h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Комфортабельный автобус и опытные гиды.
              </li>
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Уникальные маршруты: музей, храм, смотровая площадка.
              </li>
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Историческая 'Полевая кухня': обед в стиле времен ВОВ.
              </li>
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Только по субботам - ограниченные места!
              </li>
            </ul>
            <div className="text-center">
              <Link
                to="#booking"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Забронировать тур
              </Link>
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="h-screen snap-start flex items-center justify-center bg-gray-100"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Отзывы наших клиентов
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="mb-4">
                  "Невероятный опыт! Узнали много нового и интересно провели
                  время."
                </p>
                <p className="font-bold">— Иван, Москва</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="mb-4">
                  "Отличная организация и гиды. Обязательно вернусь!"
                </p>
                <p className="font-bold">— Мария, Санкт-Петербург</p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="booking"
          className="h-screen snap-start flex items-center justify-center bg-white"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Оставьте заявку на экскурсию
            </h2>
            <p className="text-center mb-8">
              Заполните форму, чтобы забронировать тур. Места ограничены!
            </p>
            <form className="max-w-md mx-auto">
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="people" className="block mb-2">
                  Количество человек
                </label>
                <input
                  type="number"
                  id="people"
                  name="people"
                  min="1"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Отправить заявку
              </button>
            </form>
          </div>
        </section>

        <section
          id="gallery"
          className="h-screen snap-start flex items-center justify-center bg-gray-100"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Фотогалерея</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <img
                src="/images/photo1.jpg"
                alt="Музейный комплекс"
                className="w-full h-64 object-cover rounded-lg"
              />
              <img
                src="/images/photo2.jpg"
                alt="Храм Вооруженных сил"
                className="w-full h-64 object-cover rounded-lg"
              />
              <img
                src="/images/photo3.jpg"
                alt="Смотровая площадка"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="h-screen snap-start flex items-center justify-center bg-white"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Часто задаваемые вопросы
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Какова продолжительность экскурсии?
                </h3>
                <p>
                  Экскурсия длится примерно 6 часов, включая дорогу до парка и
                  обратно.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Что включено в стоимость экскурсии?
                </h3>
                <p>
                  В стоимость включены проезд, входные билеты, экскурсионное
                  сопровождение и обед.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer
          id="footer"
          className="h-screen snap-start flex items-center justify-center bg-gray-800 text-white"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Юридическая информация
            </h2>
            <div className="text-center mb-8">
              <p>ИП Иванов Иван Иванович</p>
              <p>ИНН: 1234567890</p>
              <p>ОГРНИП: 123456789012345</p>
              <p>Адрес: г. Москва, ул. Примерная, д. 1</p>
              <p>Телефон: +7 (495) 123-45-67</p>
              <p>Email: info@patriot-tour.ru</p>
            </div>
            <div className="flex justify-center space-x-4 mb-8">
              <Link to="/privacy-policy" className="hover:underline">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="hover:underline">
                Публичная оферта
              </Link>
            </div>
            <p className="text-center text-sm">
              Все предоставленные на сайте данные не являются публичной офертой
              и могут быть изменены.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
