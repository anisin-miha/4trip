import PatriotPlanner from "@/app/components/ru/PatriotPlanner";
import type { FAQSectionItem } from "@/app/components/ru/FAQSection";
import {
  BLOG_TAGS_MAP,
  type BlogArticleData,
} from "@/app/components/ru/blog/types";

const ARTICLE_SLUG = "park-patriot-chto-posmotret";
const ARTICLE_URL = `https://4-trip.ru/ru/blog/${ARTICLE_SLUG}`;
const ARTICLE_TITLE = "Что посмотреть в Парке «Патриот»: обзор всех экспозиций";
const ARTICLE_DESC =
  "Полный гид по Парку «Патриот»: Главный храм ВС РФ, «Дорога Памяти», Танковый музей (Кубинка), авиация и ПВО, «Партизанская деревня», маршрут на 1 день, советы и билеты.";
const ARTICLE_IMAGE =
  "https://4-trip.ru/images/tours/patriot/cathedral-hero.png";

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: ARTICLE_TITLE,
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

const parkPatriotFaqItems: FAQSectionItem[] = [
  {
    question: "Сколько времени закладывать на Парк «Патриот»?",
    answer:
      "Минимум один полный день (6–7 часов). Для вдумчивого осмотра техники и всех музеев планируйте 2 дня.",
  },
  {
    question: "Можно ли обойтись без авто?",
    answer:
      "Да, но логистика сложнее: электричка/МКЦ до станций в Одинцовском округе + такси/шаттл. С детьми и большой компанией удобнее ехать на автобусном туре.",
  },
  {
    question: "Нужна ли предварительная запись на экскурсии?",
    answer:
      "На популярные программы и подъём на смотровые площадки лучше бронировать заранее онлайн.",
  },
  {
    question: "Подходит ли для школьных групп?",
    answer:
      "Да. Есть обзорные и тематические экскурсии, образовательные форматы и интерактивы.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: parkPatriotFaqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: typeof faq.answer === "string" ? faq.answer : "",
    },
  })),
};

const parkPatriotArticle: BlogArticleData = {
  slug: ARTICLE_SLUG,
  locale: "ru",
  url: ARTICLE_URL,
  title: ARTICLE_TITLE,
  description: ARTICLE_DESC,
  excerpt:
    "Рассказываем, почему Парк «Патриот» стоит посетить хотя бы раз: от главного храма до интерактивной военной техники.",
  coverImage: {
    url: ARTICLE_IMAGE,
    width: 1200,
    height: 630,
    alt: ARTICLE_TITLE,
  },
  publishedAt: "2025-08-14",
  updatedAt: "2025-08-14",
  badge: {
    prefix: "⚡️ Интерактив внутри статьи:",
    text: "соберите план на день",
  },
  tags: [
    BLOG_TAGS_MAP["moscow-region"],
    BLOG_TAGS_MAP.parks,
    BLOG_TAGS_MAP["major-museums"],
    BLOG_TAGS_MAP["museum-guide"],
    BLOG_TAGS_MAP["day-itinerary"],
    BLOG_TAGS_MAP["with-kids"],
  ],
  metadata: {
    title: ARTICLE_TITLE,
    description: ARTICLE_DESC,
    alternates: { canonical: ARTICLE_URL },
    openGraph: {
      type: "article",
      url: ARTICLE_URL,
      title: ARTICLE_TITLE,
      description: ARTICLE_DESC,
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
  },
  structuredData: [articleStructuredData, faqStructuredData],
  toc: [
    {
      id: "must-see",
      label: "Главные объекты «по умолчанию»",
      children: [
        {
          id: "main-temple",
          label: "Главный храм Вооружённых Сил РФ",
        },
        {
          id: "memory-road",
          label: "Музейный комплекс «Дорога Памяти»",
        },
      ],
    },
    {
      id: "museums",
      label: "Техника и музеи: что внутри",
      children: [
        { id: "kubinka", label: "Танковый музей (Кубинка)" },
        { id: "air-defense", label: "Авиация и ПВО" },
        { id: "open-areas", label: "Открытые площадки и «Поле Победы»" },
        {
          id: "partisan",
          label: "Военно-исторический комплекс «Партизанская деревня»",
        },
      ],
    },
    { id: "day-route", label: "Маршрут на один насыщенный день" },
    {
      id: "practical",
      label: "Практика: билеты, время работы, как добраться",
    },
    { id: "tips", label: "Лайфхаки и подготовка" },
    { id: "faq", label: "FAQ" },
  ],
  preface: (
    <>
      <p className="text-lg mb-4 text-gray-800">
        На связи команда <strong>4-trip</strong> — мы подготовили для вас
        практичный гид по Парку «Патриот»: что обязательно увидеть, как
        оптимально выстроить маршрут на один день, сколько времени закладывать
        на ключевые экспозиции и на что обратить внимание, чтобы поездка прошла
        идеально.
      </p>

      <blockquote className="p-4 border-l-4 border-gray-200 bg-gray-50 rounded">
        <p className="m-0">
          <strong>Кому подойдёт:</strong> семейные поездки, школьные группы,
          туристы с интересом к истории и технике, военные реконструкторы,
          инженеры и просто любопытные.
        </p>
      </blockquote>
    </>
  ),
  content: (
    <>
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
            Внешне — современное прочтение русской храмовой традиции; внутри —
            обширные экспозиции, смотровые площадки и сакральные символы,
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
            Большая иммерсивная экспозиция, проходящая вокруг храма. Концепция:
            <strong> 1418 шагов</strong> — по числу дней Великой Отечественной
            войны. Вдоль маршрута — тематические залы с погружением, хроника по
            дням, личные истории и огромная база фотографий участников (можно
            искать своих родственников).
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
        </div>
      </section>

      <section id="museums" className="mt-12">
        <h2 className="text-3xl font-semibold">Техника и музеи: что внутри</h2>

        <div id="kubinka" className="mt-6">
          <h3 className="text-2xl font-semibold">Танковый музей (Кубинка)</h3>
          <p>
            Один из самых известных в мире музеев бронетехники (история — с 1938
            года). Несколько павильонов плюс открытые площадки: советская школа,
            техника союзников и стран Оси, редчайшие прототипы и трофеи. Для
            любителей инженерии — must-see.
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
              <strong>Поствоенная эпоха:</strong> обширная линейка отечественных
              и зарубежных образцов.
            </li>
          </ul>
          <p className="text-sm text-gray-600">
            Время: от 2 часов (минимум) до полудня для вдумчивого осмотра.
          </p>
        </div>

        <div id="air-defense" className="mt-8">
          <h3 className="text-2xl font-semibold">Авиация и ПВО</h3>
          <p>
            Открытые экспозиции и павильоны с образцами отечественной авиации
            нескольких поколений. Здесь же — вертолётные экспонаты, включая
            Ми-26.
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
        </div>

        <div id="partisan" className="mt-8">
          <h3 className="text-2xl font-semibold">
            Военно-исторический комплекс «Партизанская деревня»
          </h3>
          <p>
            Интерактивный музей с реконструкцией быта и боевых эпизодов
            партизанского отряда. Акцент на сюжетах, вовлекающих детей и
            подростков.
          </p>
          <ul>
            <li>Экскурсии с актёрами/аниматорами.</li>
            <li>Тематические мастер-классы и реконструкции.</li>
            <li>Тир и интерактивные площадки.</li>
          </ul>
          <p className="text-sm text-gray-600">
            Время: 45 минут — 1,5 часа (в зависимости от программы).
          </p>
        </div>
      </section>

      <section id="day-route" className="mt-12">
        <h2 className="text-3xl font-semibold">
          Маршрут на один насыщенный день
        </h2>
        <ol>
          <li>
            <strong>Утро:</strong> прибытие и посещение Главного храма +
            смотровые площадки.
          </li>
          <li>
            <strong>День:</strong> «Дорога Памяти» → обед на территори → музей
            бронетехники.
          </li>
          <li>
            <strong>Вторая половина дня:</strong> авиация, ПВО и «Поле Победы».
          </li>
          <li>
            <strong>Финал:</strong> «Партизанская деревня» или тематический
            мастер-класс.
          </li>
        </ol>
        <p className="mt-4 text-gray-700">
          Если планируете 2 дня, во второй день можно углубиться в отдельные
          павильоны Кубинки и авиации или посетить дополнительные программы
          (стрельба, VR-аттракционы, реконструкции).
        </p>
      </section>

      <section id="practical" className="mt-12">
        <h2 className="text-3xl font-semibold">
          Практика: билеты, время работы, как добраться
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          <div>
            <h3 className="text-xl font-semibold">Билеты и форматы посещения</h3>
            <ul className="mt-2">
              <li>
                <strong>Единый билет</strong> на территорию + музейные комплексы.
              </li>
              <li>
                Разделение по зонам (храм, «Дорога Памяти», Кубинка, авиация и
                т.д.) — можно комбинировать.
              </li>
              <li>Групповые туры с трансфером из Москвы.</li>
              <li>Специальные экскурсии для школ и корпоративов.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Как добраться</h3>
            <ul className="mt-2">
              <li>
                <strong>На авто:</strong> 60 км от Москвы (Одинцовский округ),
                парковки на месте.
              </li>
              <li>
                <strong>Общественный транспорт:</strong> электричка/МКЦ до
                станций Кубинка/Голицыно → автобус/шаттл.
              </li>
              <li>
                <strong>Организованные туры:</strong> автобусы от метро
                (Кутузовская/Партизанская и т.д.).
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold">Время работы</h3>
          <ul className="mt-2">
            <li>
              Парк открыт круглый год, основная часть экспозиций — ежедневно.
            </li>
            <li>
              Часть зон (стрельбища, реконструкции) работают по графику /
              расписанию мероприятий.
            </li>
            <li>Следите за обновлениями на официальном сайте и в соцсетях.</li>
          </ul>
        </div>
      </section>

      <section id="tips" className="mt-12">
        <h2 className="text-3xl font-semibold">Лайфхаки и подготовка</h2>
        <ul className="mt-4">
          <li>
            Планы павильонов выдаются на входе — попросите печатную карту или
            загрузите в телефон.
          </li>
          <li>
            Одевайтесь по погоде: между павильонами есть открытые участки,
            ветер.
          </li>
          <li>
            Для детей и школьников продумайте маршрут с интерактивами
            («Партизанская деревня», VR, мастер-классы).
          </li>
          <li>
            Закладывайте время на дорогу: пробки на Минском шоссе и очереди на
            входе в пиковые дни.
          </li>
          <li>
            Фотографировать внутри можно почти везде, но для коммерческих съёмок
            нужна аккредитация.
          </li>
        </ul>
      </section>
    </>
  ),
  afterContent: (
    <section id="planner" className="mt-12">
      <div className="not-prose">
        <PatriotPlanner />
      </div>
    </section>
  ),
  relatedArticles: {
    title: "Читайте также",
    limit: 3,
  },
  faq: {
    id: "faq",
    title: "FAQ",
    headingTag: "h2",
    headingClassName: "text-left",
    className: "mt-16 py-0 bg-transparent not-prose",
    containerClassName: null,
    listClassName: "mt-6 space-y-4",
    itemClassName: "group rounded border p-4",
    summaryClassName:
      "cursor-pointer select-none text-lg font-semibold flex items-center justify-between",
    answerClassName: "mt-2 text-gray-700",
    chevron: "▾",
    items: parkPatriotFaqItems,
  },
  discussionId: "fourtrip/13",
};

export default parkPatriotArticle;
