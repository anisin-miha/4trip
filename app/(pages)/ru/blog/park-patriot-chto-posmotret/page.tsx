import { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import { Header } from "@4trip/shared-ui";
import SiteFooter from "@/app/components/SiteFooter";
import contactInfo from "@/app/config/contactInfo";
import { TelegramComments } from "@/app/components/TelegramComments";
import SocialShare from "@/app/components/SocialShare";
import PatriotPlanner from "@/app/components/PatriotPlanner";
// import RelatedTours from "@/app/components/RelatedTours";

// Фактический путь страницы в проекте локалей — с префиксом /ru
const ARTICLE_URL = "https://4-trip.ru/ru/blog/park-patriot-chto-posmotret";
const ARTICLE_TITLE = "Что посмотреть в Парке «Патриот»: обзор всех экспозиций";
const ARTICLE_DESC =
  "Полный гид по Парку «Патриот»: Главный храм ВС РФ, «Дорога Памяти», Танковый музей (Кубинка), авиация и ПВО, «Партизанская деревня», маршрут на 1 день, советы и билеты.";
// Используем реальный файл из public/images/patriot
const ARTICLE_IMAGE = "https://4-trip.ru/images/patriot/cathedral-hero.png";

export const metadata: Metadata = {
  title: ARTICLE_TITLE,
  description: ARTICLE_DESC,
  alternates: { canonical: ARTICLE_URL },
  openGraph: {
    type: "article",
    url: ARTICLE_URL,
    title: ARTICLE_TITLE,
    description: ARTICLE_DESC,
    // Эти поля помогают Telegram/FB корректнее распознавать статью
    publishedTime: "2025-08-14",
    modifiedTime: "2025-08-14",
    authors: ["4-trip"],
    images: [
      {
        url: ARTICLE_IMAGE,
        width: 1200,
        height: 630,
        alt: ARTICLE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ARTICLE_TITLE,
    description: ARTICLE_DESC,
    images: [ARTICLE_IMAGE],
  },
};

export default function BlogPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Сколько времени закладывать на Парк «Патриот»?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Минимум один полный день (6–7 часов). Для вдумчивого осмотра техники и всех музеев планируйте 2 дня.",
        },
      },
      {
        "@type": "Question",
        name: "Можно ли обойтись без авто?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да, но логистика сложнее: электричка/МКЦ до станций в Одинцовском округе + такси/шаттл. С детьми и большой компанией удобнее ехать на автобусном туре.",
        },
      },
      {
        "@type": "Question",
        name: "Нужна ли предварительная запись на экскурсии?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "На популярные программы и подъём на смотровые площадки лучше бронировать заранее онлайн.",
        },
      },
      {
        "@type": "Question",
        name: "Подходит ли для школьных групп?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Да. Есть обзорные и тематические экскурсии, образовательные форматы и интерактивы.",
        },
      },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Что посмотреть в Парке «Патриот»: обзор всех экспозиций",
    description:
      "Полный гид по Парку «Патриот»: Главный храм ВС РФ, «Дорога Памяти», Танковый музей (Кубинка), авиация и ПВО, «Партизанская деревня», маршруты на 1 день, советы и билеты.",
    inLanguage: "ru-RU",
    isPartOf: { "@type": "Blog", name: "4-trip.ru" },
    datePublished: "2025-08-14",
    dateModified: "2025-08-14",
    author: { "@type": "Organization", name: "4-trip" },
    publisher: { "@type": "Organization", name: "4-trip" },
    mainEntityOfPage: { "@type": "WebPage", "@id": ARTICLE_URL },
  };

  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <SiteHeader title="Блог" main project="trip" links={[{ href: "/ru", label: "Главная" }, { href: "/ru/blog", label: "Блог" }, { href: "/ru/contacts", label: "Контакты" }]} />

      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        {/* JSON-LD (микроразметка) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <article className="prose prose-lg max-w-3xl prose-h2:mt-12 prose-h3:mt-8 prose-ul:list-disc">
          {/* заголовок */}
          <h1 className="text-4xl font-bold mb-2">
            Что посмотреть в Парке «Патриот»: обзор всех экспозиций
          </h1>
          {/* badge: обозначаем наличие интерактива в статье */}
          <div className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 mb-4">
            <span>⚡️ Интерактив внутри статьи:</span>
            <span className="whitespace-nowrap">соберите план на день</span>
          </div>

          {/* НОВЫЙ персонализированный абзац */}
          <p className="text-lg mb-4 text-gray-800">
            На связи команда <strong>4-trip</strong> — мы подготовили для вас
            практичный гид по Парку «Патриот»: что обязательно увидеть, как
            оптимально выстроить маршрут на один день, сколько времени
            закладывать на ключевые экспозиции и на что обратить внимание, чтобы
            поездка прошла идеально.
          </p>

          <blockquote className="p-4 border-l-4 border-gray-200 bg-gray-50 rounded">
            <p className="m-0">
              <strong>Кому подойдёт:</strong> семейные поездки, школьные группы,
              туристы с интересом к истории и технике, военные реконструкторы,
              инженеры и просто любопытные.
            </p>
          </blockquote>

          {/* Placeholder hero illustration */}
          {/*
          <figure className="my-8">
            <div className="relative w-full aspect-[16/9] bg-gray-100 border rounded flex items-center justify-center text-gray-500">
              <span>public/images/blog/patriot/hero-cathedral-entrance.jpg</span>
            </div>
            <figcaption className="mt-2 text-sm text-gray-600">
              Главный храм ВС РФ — общий вид (герой фото для статьи)
            </figcaption>
          </figure>
          */}

          {/* Оглавление */}
          <nav aria-label="Содержание" className="mt-8 mb-10">
            <h2 className="text-2xl font-semibold mb-4">Содержание</h2>
            <ul className="space-y-2 marker:text-gray-400 list-disc pl-5">
              <li>
                <a href="#must-see" className="hover:underline">
                  Главные объекты «по умолчанию»
                </a>
                <ul className="list-disc pl-5 mt-2">
                  <li>
                    <a href="#main-temple" className="hover:underline">
                      Главный храм Вооружённых Сил РФ
                    </a>
                  </li>
                  <li>
                    <a href="#memory-road" className="hover:underline">
                      Музейный комплекс «Дорога Памяти»
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#museums" className="hover:underline">
                  Техника и музеи: что внутри
                </a>
                <ul className="list-disc pl-5 mt-2">
                  <li>
                    <a href="#kubinka" className="hover:underline">
                      Танковый музей (Кубинка)
                    </a>
                  </li>
                  <li>
                    <a href="#air-defense" className="hover:underline">
                      Авиация и ПВО
                    </a>
                  </li>
                  <li>
                    <a href="#open-areas" className="hover:underline">
                      Открытые площадки и «Поле Победы»
                    </a>
                  </li>
                  <li>
                    <a href="#partisan" className="hover:underline">
                      Военно-исторический комплекс «Партизанская деревня»
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#day-route" className="hover:underline">
                  Маршрут на один насыщенный день
                </a>
              </li>
              <li>
                <a href="#practical" className="hover:underline">
                  Практика: билеты, время работы, как добраться
                </a>
              </li>
              <li>
                <a href="#tips" className="hover:underline">
                  Лайфхаки и подготовка
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:underline">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <section id="must-see">
            <h2 className="text-3xl font-semibold">
              Главные объекты «по умолчанию»
            </h2>

          <div id="main-temple" className="mt-6">
            <h3 className="text-2xl font-semibold">
              Главный храм Вооружённых Сил РФ
            </h3>
            <p>
                Монументальный собор — архитектурная доминанта Парка «Патриот».
                Внешне — современное прочтение русской храмовой традиции; внутри
                — обширные экспозиции, смотровые площадки и сакральные символы,
                посвящённые вкладу народа и армии. Если вы в парке впервые,
                начинайте именно отсюда: пространства спроектированы так, чтобы
                задать эмоциональный тон всей поездке.
              </p>
              <p className="font-medium">Что не пропустить:</p>
              <ul>
                <li>Панорамные виды со смотровых площадок.</li>
                <li>Тематические залы с мультимедийными инсталляциями.</li>
                <li>Экскурсионные программы по комплексу.</li>
              </ul>
              <p className="text-sm text-gray-600">Время: 60–90 минут.</p>
            </div>

            <div id="memory-road" className="mt-8">
              <h3 className="text-2xl font-semibold">
                Музейный комплекс «Дорога Памяти»
              </h3>
            <p>
                Большая иммерсивная экспозиция, проходящая вокруг храма.
                Концепция:
                <strong> 1418 шагов</strong> — по числу дней Великой
                Отечественной войны. Вдоль маршрута — тематические залы с
                погружением, хроника по дням, личные истории и огромная база
                фотографий участников (можно искать своих родственников).
              </p>
              <p className="font-medium">Что не пропустить:</p>
              <ul>
                <li>
                  Иммерсивные залы с реконструкциями ключевых эпизодов войны.
                </li>
                <li>Поиск участников в цифровой базе.</li>
                <li>Связка «храм → галерея → открытые площадки».</li>
              </ul>
              <p className="text-sm text-gray-600">Время: 60–90 минут.</p>
              {/* Placeholder: Memory Road gallery corridor */}
              {/*
              <figure className="my-6">
                <div className="relative w-full aspect-[16/9] bg-gray-100 border rounded flex items-center justify-center text-gray-500">
                  <span>public/images/blog/patriot/memory-road-gallery.jpg</span>
                </div>
                <figcaption className="mt-2 text-sm text-gray-600">
                  «Дорога Памяти» — галерея с мультимедийными инсталляциями
                </figcaption>
              </figure>
              */}
            </div>
          </section>

          <section id="museums" className="mt-12">
            <h2 className="text-3xl font-semibold">
              Техника и музеи: что внутри
            </h2>

            <div id="kubinka" className="mt-6">
              <h3 className="text-2xl font-semibold">
                Танковый музей (Кубинка)
              </h3>
              <p>
                Один из самых известных в мире музеев бронетехники (история — с
                1938 года). Несколько павильонов плюс открытые площадки:
                советская школа, техника союзников и стран Оси, редчайшие
                прототипы и трофеи. Для любителей инженерии — must-see.
              </p>
              <p className="font-medium">Хайлайты коллекции:</p>
              <ul>
                <li>
                  <strong>Уникаты:</strong> сверхтяжёлый прототип Panzer VIII
                  «Maus», мортира Karl-Gerät, опытный «Объект 279», СУ-100-Y.
                </li>
                <li>
                  <strong>Классика Второй мировой:</strong> Tiger I, «Пантера»,
                  Т-34, ИС-2 и др.
                </li>
                <li>
                  <strong>Поствоенная эпоха:</strong> обширная линейка
                  отечественных и зарубежных образцов.
                </li>
              </ul>
              <p className="text-sm text-gray-600">
                Время: от 2 часов (минимум) до полудня для вдумчивого осмотра.
              </p>
              {/* Placeholder: Kubinka tanks hall */}
              {/*
              <figure className="my-6">
                <div className="relative w-full aspect-[16/9] bg-gray-100 border rounded flex items-center justify-center text-gray-500">
                  <span>public/images/blog/patriot/kubinka-tanks-hall.jpg</span>
                </div>
                <figcaption className="mt-2 text-sm text-gray-600">
                  Павильон танков в Кубинке — ряд экспонатов под одной крышей
                </figcaption>
              </figure>
              */}
            </div>

            <div id="air-defense" className="mt-8">
              <h3 className="text-2xl font-semibold">Авиация и ПВО</h3>
              <p>
                Открытые экспозиции и павильоны с образцами отечественной
                авиации нескольких поколений. Здесь же — вертолётные экспонаты,
                включая Ми-26.
              </p>
              <p className="font-medium">Что посмотреть:</p>
              <ul>
                <li>
                  Реактивные самолёты: МиГ-17, МиГ-19, МиГ-29; фронтовые
                  бомбардировщики Су-24 и штурмовики Су-25.
                </li>
                <li>
                  Военно-транспортная авиация (Ан-12, Ан-26) и средства ПВО.
                </li>
              </ul>
              <p className="text-sm text-gray-600">
                Время: 60–90 минут (до 2–3 часов для энтузиастов).
              </p>
              {/* Placeholder: Aviation lineup */}
              {/*
              <figure className="my-6">
                <div className="relative w-full aspect-[16/9] bg-gray-100 border rounded flex items-center justify-center text-gray-500">
                  <span>public/images/blog/patriot/aviation-pvo-lineup.jpg</span>
                </div>
                <figcaption className="mt-2 text-sm text-gray-600">
                  Открытая экспозиция авиации и средств ПВО
                </figcaption>
              </figure>
              */}
            </div>

            <div id="open-areas" className="mt-8">
              <h3 className="text-2xl font-semibold">
                Открытые площадки и «Поле Победы»
              </h3>
              <p>
                Под открытым небом — единицы техники, диорамы и инсталляции,
                посвящённые обороне Москвы и ключевым эпизодам войны. Отличный
                вариант для прогулки между музейными блоками.
              </p>
              <p className="text-sm text-gray-600">Время: 45–60 минут.</p>
              {/* Placeholder: Field of Victory */}
              {/*
              <figure className="my-6">
                <div className="relative w-full aspect-[16/9] bg-gray-100 border rounded flex items-center justify-center text-gray-500">
                  <span>public/images/blog/patriot/open-areas-field-of-victory.jpg</span>
                </div>
                <figcaption className="mt-2 text-sm text-gray-600">
                  «Поле Победы» — открытые площадки с крупной техникой
                </figcaption>
              </figure>
              */}
            </div>

            <div id="partisan" className="mt-8">
              <h3 className="text-2xl font-semibold">
                Военно-исторический комплекс «Партизанская деревня»
              </h3>
              <p>
                Интерактивный музей с реконструкцией партизанского лагеря:
                блиндажи, штаб, «школа диверсанта», связь, быт, оружейный склад.
                Экскурсии часто с элементами участия — детям и подросткам обычно
                «заходит».
              </p>
              <p className="text-sm text-gray-600">Время: 40–60 минут.</p>
              {/* Placeholder: Partisan village interactive */}
              {/*
              <figure className="my-6">
                <div className="relative w-full aspect-[16/9] bg-gray-100 border rounded flex items-center justify-center text-gray-500">
                  <span>public/images/blog/patriot/partisan-village-exhibit.jpg</span>
                </div>
                <figcaption className="mt-2 text-sm text-gray-600">
                  «Партизанская деревня» — интерактивные точки и реконструкции
                </figcaption>
              </figure>
              */}
            </div>
          </section>

          <section id="day-route" className="mt-12">
            <h2 className="text-3xl font-semibold">
              Маршрут на один насыщенный день
            </h2>
            {/* Placeholder: suggested day route map */}
            {/*
            <figure className="my-4">
              <div className="relative w-full aspect-[16/9] bg-gray-100 border rounded flex items-center justify-center text-gray-500">
                <span>public/images/blog/patriot/day-route-map.png</span>
              </div>
              <figcaption className="mt-2 text-sm text-gray-600">
                Карта предложенного маршрута по Парку «Патриот»
              </figcaption>
            </figure>
            */}
            <ul>
              <li>
                <strong>09:50–10:00</strong> — вход, ориентирование, кофе.
              </li>
              <li>
                <strong>10:00–11:30</strong> — Главный храм (интерьеры +
                смотровая).
              </li>
              <li>
                <strong>11:30–12:45</strong> — «Дорога Памяти».
              </li>
              <li>
                <strong>12:45–13:30</strong> — обед (в сезон закладывайте
                буфер).
              </li>
              <li>
                <strong>13:30–15:30</strong> — Танковый музей (Кубинка).
              </li>
              <li>
                <strong>15:30–16:30</strong> — Авиация и ПВО.
              </li>
              <li>
                <strong>16:30–17:15</strong> — «Партизанская деревня».
              </li>
              <li>
                <strong>17:15–18:00</strong> — сувениры, «Поле Победы», выезд.
              </li>
            </ul>
            <p className="text-sm text-gray-600">
              С детьми чередуйте формат «зал → улица», на технику закладывайте
              больше времени.
            </p>
          </section>

          <section id="practical" className="mt-12">
            <h2 className="text-3xl font-semibold">
              Практика: билеты, время работы, как добраться
            </h2>
            <h3 className="text-xl font-semibold mt-4">
              Время работы (ориентиры)
            </h3>
            <ul>
              <li>
                <strong>Вт–Пт:</strong> 10:00–18:00 (кассы до 17:00)
              </li>
              <li>
                <strong>Сб–Вс:</strong> 10:00–19:00 (кассы до 18:00)
              </li>
              <li>
                <strong>Пн:</strong> выходной
              </li>
            </ul>
            <p className="text-sm text-gray-600">
              Расписание и цены периодически меняются — проверяйте на
              официальных страницах перед поездкой.
            </p>

            <h3 className="text-xl font-semibold mt-6">Билеты и экскурсии</h3>
            <ul>
              <li>
                На многие локации действуют отдельные билеты и экскурсионные
                программы.
              </li>
              <li>
                Онлайн-покупка ускоряет вход и бронирование популярных слотов.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6">Как добраться</h3>
            <ul>
              <li>
                <strong>Авто:</strong> Минское шоссе, ~55-й км (парковки у
                кластеров).
              </li>
              <li>
                <strong>Общественный транспорт:</strong> станции
                Кубинка/Голицыно + такси/шаттл. В дни форума «АРМИЯ» возможны
                изменения движения.
              </li>
            </ul>
          </section>

          <section id="tips" className="mt-12">
            <h2 className="text-3xl font-semibold">Лайфхаки и подготовка</h2>
            <ul>
              <li>
                <strong>Время:</strong> полный осмотр — минимум 6–7 часов; для
                глубины — 2 дня.
              </li>
              <li>
                <strong>Обувь и погода:</strong> много открытых площадок;
                удобная обувь, вода, головной убор.
              </li>
              <li>
                <strong>Питание:</strong> в высокий сезон очереди в кафе —
                планируйте буфер.
              </li>
              <li>
                <strong>Фото/видео:</strong> бытовая съёмка обычно свободна;
                профессиональная — по правилам площадки.
              </li>
              <li>
                <strong>С детьми:</strong> «Партизанская деревня», открытые
                площадки, интерактивы — идеальный микс.
              </li>
            </ul>
          </section>

          <section id="faq" className="mt-12">
            <h2 className="text-3xl font-semibold">FAQ</h2>
            <div className="space-y-6">
              <details className="group rounded border p-4">
                <summary className="cursor-pointer font-medium">
                  Сколько времени закладывать на Парк «Патриот»?
                </summary>
                <p className="mt-2">
                  Минимум один полный день (6–7 часов). Для вдумчивого осмотра
                  техники и всех музеев планируйте 2 дня.
                </p>
              </details>
              <details className="group rounded border p-4">
                <summary className="cursor-pointer font-medium">
                  Можно ли обойтись без авто?
                </summary>
                <p className="mt-2">
                  Да, но логистика сложнее: электричка/МКЦ до станций в
                  Одинцовском округе + такси/шаттл. С детьми и большой компанией
                  удобнее ехать на автобусном туре.
                </p>
              </details>
              <details className="group rounded border p-4">
                <summary className="cursor-pointer font-medium">
                  Нужна ли предварительная запись на экскурсии?
                </summary>
                <p className="mt-2">
                  На популярные программы и подъём на смотровые площадки лучше
                  бронировать заранее онлайн.
                </p>
              </details>
              <details className="group rounded border p-4">
                <summary className="cursor-pointer font-medium">
                  Подходит ли для школьных групп?
                </summary>
                <p className="mt-2">
                  Да. Есть обзорные и тематические экскурсии, образовательные
                  форматы и интерактивы.
                </p>
              </details>
            </div>
          </section>

          {/* CTA */}
          {/* <div className="mt-12 flex flex-wrap items-center gap-4">
            <a href="#booking" className="inline-block px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800">
              Оставить заявку на тур в Парк «Патриот»
            </a>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
            >
              На главную
            </Link>
          </div> */}

          {/* Внутренние ссылки (SEO) */}
          {/* <div className="mt-8 text-sm text-gray-600">
            См. также:{" "}
            <Link href="/blog" className="underline">
              как добраться
            </Link>
            ,{" "}
            <Link href="/blog" className="underline">
              куда пойти с детьми
            </Link>
            ,{" "}
            <Link href="/blog" className="underline">
              обзор техники Кубинки
            </Link>
            ,{" "}
            <Link href="/blog" className="underline">
              лучшие фото-точки
            </Link>
            .
          </div> */}
        </article>

        <section id="planner" className="mt-12">
          <div className="not-prose">
            <PatriotPlanner />
          </div>
        </section>
        <SocialShare
          url={ARTICLE_URL}
          title={ARTICLE_TITLE}
          description={ARTICLE_DESC}
          image={ARTICLE_IMAGE}
          hashtags={["ПаркПатриот", "экскурсии", "Подмосковье"]}
          via="4_trip_ru" // для X (необязательно)
          utm={{
            utm_source: "share",
            utm_medium: "social",
            utm_campaign: "park-patriot",
          }}
          networks={["telegram", "vk", "whatsapp", "x", "facebook"]} // порядок важен
          className="mt-6 mb-10"
        />
        <TelegramComments discussion={"fourtrip/13"} />
      </main>
      {/* 
      <div id="booking" className="scroll-mt-24">
        <BookingForm price={0} tourName={"Парк «Патриот»"} />
      </div> */}


        {/* Related tours (готовый блок)
        <div className="mt-12">
          <RelatedTours  />
        </div> */}


      <SiteFooter project="trip" contacts={{ phone: contactInfo.phone, social: contactInfo.social }} />
    </div>
  );
}
