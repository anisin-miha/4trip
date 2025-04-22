import Link from "next/link";
import Header from "../../components/Header";
import BaseImage from "@/components/BaseImage";
import BookingForm from "../../components/BookingForm";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <div className="font-sans bg-gray-100 scroll-smooth">
      <Header title="Парк «Патриот»" />

      <main>
        <section
          id="hero"
          className="relative h-screen flex items-center scroll-mt-16"
        >
          <BaseImage
            src={"/images/patriot/cathedral-hero.png"}
            alt="Главный храм Вооруженных сил России"
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
                  Парк «Патриот»
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-100">
                  Посетите величественный храм Вооруженных сил
                  и&nbsp;прикоснитесь к&nbsp;истории России
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
              Вы&nbsp;посетите:
            </h2>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <BaseImage
                  src="/images/patriot/road-of-memory.png"
                  alt="Музей 'Дорога памяти'"
                  width={600}
                  height={600}
                  className="w-full h-128 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Музей &laquo;Дорога памяти&raquo;
                  </h3>
                  <p className="mb-4">
                    Музей &laquo;Дорога памяти&raquo; опоясывает Главный храм
                    Вооруженных Сил России. Это галерея протяженностью
                    в&nbsp;1418&nbsp;шагов, где рассказана подробная история
                    каждого дня Великой Отечественной войны, создана максимально
                    достоверная атмосфера событий 1941-1945&nbsp;годов.
                  </p>
                  <p className="mb-4">
                    Здесь можно пережить путь от&nbsp;трагических событий начала
                    войны, до&nbsp;триумфального входа Советской армии
                    в&nbsp;Берлин.
                  </p>
                  <p>
                    Музей погружает в&nbsp;обстановку значительных этапов войны
                    - Оборона Брестской крепости, Оборона Москвы, Оборона
                    Сталинграда, Ледяная Дорога Жизни к&nbsp;блокадному
                    Ленинграду и т.п. Всего в&nbsp;музее 35&nbsp;залов,
                    26&nbsp;из&nbsp;которых, иммерсивные с эффектом погружения.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <BaseImage
                  src="/images/patriot/armed-forces-cathedral.png"
                  alt="Храм Вооруженных сил"
                  width={600}
                  height={600}
                  className="w-full h-128 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Главный храм Вооруженных Сил России
                  </h3>
                  <p className="mb-4">
                    Главный храм Вооруженных Сил России&nbsp;&mdash; новая
                    страница истории Отечества и&nbsp;русского оружия.
                    В&nbsp;России испокон веков возводились храмы в&nbsp;память
                    о&nbsp;своих защитниках.
                  </p>
                  <p className="mb-4">
                    Храм построен в&nbsp;честь Воскресения Христова, посвящен
                    75-летию Победы в&nbsp;Великой Отечественной войне,
                    а&nbsp;также ратным подвигам русского народа во&nbsp;всех
                    войнах, выпавших на долю нашей страны. Возвели его
                    на&nbsp;территории парка &laquo;Патриот&raquo;
                    в&nbsp;рекордные сроки&nbsp;&mdash; 1,5&nbsp;года.
                  </p>
                  <p>
                    Храм спроектирован в&nbsp;монументальном русском стиле,
                    органично включающем современные архитектурные подходы
                    и&nbsp;уникальные для православного храмоздательства
                    нововведения. Фасады здания отделаны металлом,
                    своды&nbsp;&mdash; остеклены.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                Вы&nbsp;узнаете:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>историю создания проекта;</li>
                  <li>почему комплекс возник именно на&nbsp;этом месте;</li>
                  <li>
                    что означают цифры на&nbsp;верстовом столбе-указателе;
                  </li>
                  <li>зачем военным свой храм;</li>
                  <li>об&nbsp;авторах проекта, художниках, скульпторах;</li>
                  <li>
                    кто участвовал в&nbsp;сборе пожертвований
                    на&nbsp;строительство храма;
                  </li>
                  <li>
                    почему Главный храм Вооружённых Сил&nbsp;&mdash; цвета
                    патины;
                  </li>
                  <li>из&nbsp;каких материалов выполнен храм;</li>
                  <li>чем уникальны иконы храма;</li>
                </ul>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    символику цифр в&nbsp;размерах куполов, витражей, высоты
                    колокольни и&nbsp;других элементах храма;
                  </li>
                  <li>
                    что добавили в&nbsp;сплав, из&nbsp;которого изготовлены
                    ступени храма;
                  </li>
                  <li>что изображено на&nbsp;витражах вместо святых ликов;</li>
                  <li>
                    какую деревянную доску использовали для написания иконы
                    Спаса Нерукотворного;
                  </li>
                  <li>какие святые покровительствуют родам войск;</li>
                  <li>какие сюжеты изображены на&nbsp;мозаичных панно;</li>
                  <li>
                    размещены&nbsp;ли данные ваших родственников в&nbsp;галерее
                    участников войны &laquo;Дорога памяти&raquo;;
                  </li>
                  <li>И&nbsp;многое другое...</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg shadow-md p-8 mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                Важные детали:
              </h3>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  дети до&nbsp;7&nbsp;лет могут путешествовать в&nbsp;составе
                  сборной группы только по&nbsp;согласованию;
                </li>
                <li>
                  несовершеннолетние дети (с&nbsp;7&nbsp;до&nbsp;18&nbsp;лет)
                  участвуют в&nbsp;сборных группах только в&nbsp;сопровождении
                  своих законных представителей;
                </li>
                <li>
                  транспортное обслуживание по&nbsp;программе: автобус
                  туристического класса. При группе менее 24&nbsp;человек
                  предоставляется микроавтобус туристического класса;
                </li>
                <li>
                  не&nbsp;рекомендуется входить на&nbsp;территорию храма
                  женщинам в брюках, коротких и&nbsp;открытых платьях, мужчинам
                  в&nbsp;шортах и открытых майках;
                </li>
                <li>одеваемся по&nbsp;погоде;</li>
                <li>фотосъемка разрешена.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-16 bg-white scroll-mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Отзывы наших клиентов
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <p className="mb-4 italic">
                  &laquo;Невероятный опыт! Узнали много нового
                  и&nbsp;интересного о&nbsp;военной истории нашей страны.
                  Особенно впечатлил храм Вооруженных сил.&raquo;
                </p>
                <p className="font-bold">&mdash;&nbsp;Иван, Москва</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <p className="mb-4 italic">
                  &laquo;Отличная организация и&nbsp;замечательные гиды.
                  Экскурсия очень информативная и&nbsp;интересная. Обязательно
                  вернусь с&nbsp;семьей.&raquo;
                </p>
                <p className="font-bold">&mdash;&nbsp;Мария, Санкт-Петербург</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <p className="mb-4 italic">
                  &laquo;Поездка превзошла все ожидания. Музей &rsquo;Дорога
                  памяти&rsquo; оставил неизгладимое впечатление. Спасибо
                  за&nbsp;такую возможность!&raquo;
                </p>
                <p className="font-bold">
                  &mdash;&nbsp;Алексей, Нижний Новгород
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="meeting" className="py-16 bg-gray-100  scroll-mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Место встречи и маршрут
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=37.523504,55.740533&z=16&pt=37.523504,55.740533,pm2rdm"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Место встречи"
                />
              </div>

              {/* Правый столбец — блок информации */}
              <div className="p-6 rounded-lg">
                <ul className="space-y-4 text-gray-800">
                  <li>
                    <span className="font-semibold">Тип экскурсии:</span>{" "}
                    Групповая сборная
                  </li>
                  <li>
                    <span className="font-semibold">Время начала:</span> 08:45
                  </li>
                  <li>
                    <span className="font-semibold">Длительность:</span> около 9
                    ч.
                  </li>
                  <li>
                    <span className="font-semibold">Место встречи:</span>{" "}
                    метро Парк Победы
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mx-1 align-middle"></span>
                    <span className="text-sm text-gray-600">синяя линия</span>,
                    парковка у музея Бородинской битвы
                  </li>
                  <li>
                    <span className="font-semibold">Место окончания:</span>{" "}
                    метро Парк Победы, парковка около музея
                  </li>
                  <li>
                    <span className="font-semibold">Размер группы:</span> До 50
                    человек
                  </li>
                  <li>
                    <span className="font-semibold">Для кого:</span> Можно с
                    детьми
                  </li>
                  <li>
                    <span className="font-semibold">Язык экскурсии:</span>{" "}
                    русский
                  </li>
                  <li>
                    <span className="font-semibold">Стоимость:</span> 2 500 ₽ с
                    человека
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="booking" className="py-16 bg-white scroll-mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Забронируйте свое место на&nbsp;экскурсию
            </h2>
            <p className="text-center mb-8">
              Заполните форму, и&nbsp;мы&nbsp;свяжемся с&nbsp;вами для
              подтверждения бронирования. Места ограничены!
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
                src="/images/patriot/gallery1.png"
                alt="Галерея 1"
                width={300}
                height={200}
                className="w-full h-64 object-cover rounded-lg"
              />
              <BaseImage
                src="/images/patriot/gallery2.png"
                alt="Галерея 2"
                width={300}
                height={200}
                className="w-full h-64 object-cover rounded-lg"
              />
              <BaseImage
                src="/images/patriot/gallery3.png"
                alt="Галерея 3"
                width={300}
                height={200}
                className="w-full h-64 object-cover rounded-lg"
              />
              <BaseImage
                src="/images/patriot/gallery4.png"
                alt="Галерея 4"
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
                  Какова продолжительность экскурсии?
                </h3>
                <p>
                  Экскурсия длится примерно 9&nbsp;часов, включая дорогу
                  до&nbsp;парка и обратно.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Что включено в&nbsp;стоимость экскурсии?
                </h3>
                <p>
                  В&nbsp;стоимость включены проезд на&nbsp;комфортабельном
                  автобусе, входные билеты во&nbsp;все объекты парка
                  и&nbsp;экскурсионное сопровождение.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Можно&nbsp;ли брать с&nbsp;собой детей?
                </h3>
                <p>
                  Да, экскурсия подходит для всей семьи. Дети до&nbsp;7&nbsp;лет
                  могут посетить парк по&nbsp;согласованию, а&nbsp;дети
                  от&nbsp;7&nbsp;до&nbsp;18&nbsp;лет&nbsp;&mdash; только
                  в&nbsp;сопровождении законных представителей.
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
