import {
  BLOG_TAGS_MAP,
  type BlogArticleData,
  type FAQSectionItem,
} from "@/app/components/ru/blog/types";

const ARTICLE_ID = "bulgakov-moscow";
const SLUG = "bulgakovskaya-moskva-serp-synthesis";
const URL = `https://4-trip.ru/ru/blog/${SLUG}`;
const TITLE = "Булгаковская Москва: адреса, версии и короткий маршрут";
const DESC =
  "Патриаршие пруды, Садовая, 10, версия «Дома Грибоедова» на Тверском бульваре, «Варьете» у Триумфальной и трамвайный миф — в одном материале с картой и маршрутной логикой.";
const COVER = "/images/blog/bulgakov/cover.jpg";

/**
 * Булгаковская Москва — SERP‑синтез: анализ верхних статей, выжимка лучшего, подача в одном материале.
 * Без следования прошлым шаблонам: структура ровно такая, чтобы отвечать на частые намерения пользователя из выдачи.
 */

const faq: FAQSectionItem[] = [
  {
    question: "Где начать прогулку по булгаковской Москве?",
    answer:
      "У Патриарших прудов: отсюда удобно пройти к Большой Садовой, 10, затем к Триумфальной площади и Тверскому бульвару, 25.",
  },
  {
    question: "Есть ли точные адреса «Варьете» и «Дома Грибоедова»?",
    answer:
      "Корректнее говорить о версиях. Чаще всего называют Театр Сатиры на Триумфальной пл., 2 и Дом Герцена на Тверском бульваре, 25.",
  },
  {
    question: "Сколько времени заложить?",
    answer: "2–3 часа на ключевые точки, плюс 45–60 минут, если заходите в музей на Садовой, 10.",
  },
  {
    question: "Подойдёт ли маршрут для детей?",
    answer: "Да, в светлое время; планируйте паузы у лавочек и избегайте пиковых часов у музея.",
  },
];

const articleData: BlogArticleData = {
  visibility: false,
  id: ARTICLE_ID,
  slug: SLUG,
  locale: "ru",
  url: URL,
  title: TITLE,
  description: DESC,
  excerpt:
    "Адресный ориентир по булгаковской Москве: Патриаршие, «нехорошая квартира» на Садовой, версии «Грибоедова» и «Варьете», плюс трамвайный миф — с картой и кратким маршрутом.",
  coverImage: { url: COVER, width: 1200, height: 630, alt: TITLE },
  publishedAt: "2025-11-03",
  updatedAt: "2025-11-03",
  tags: [
    BLOG_TAGS_MAP["mikhail-bulgakov"],
    BLOG_TAGS_MAP["patriarch-ponds"],
    BLOG_TAGS_MAP["route"],
    BLOG_TAGS_MAP["place-history"],
  ],
  metadata: {
    title: TITLE,
    description: DESC,
    alternates: { canonical: URL },
    openGraph: {
      type: "article",
      url: URL,
      title: TITLE,
      description: DESC,
      publishedTime: "2025-11-03",
      modifiedTime: "2025-11-03",
      authors: ["4-trip"],
      images: [{ url: COVER, width: 1200, height: 630, alt: TITLE }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESC,
      images: [COVER],
    },
  },
  structuredData: [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: TITLE,
      description: DESC,
      inLanguage: "ru-RU",
      isPartOf: { "@type": "Blog", name: "4-trip.ru" },
      datePublished: "2025-11-03",
      dateModified: "2025-11-03",
      author: { "@type": "Organization", name: "4-trip" },
      publisher: { "@type": "Organization", name: "4-trip" },
      mainEntityOfPage: { "@type": "WebPage", "@id": URL },
      image: [COVER],
    },
  ],
  toc: [
    { id: "intro", label: "Вступление" },
    { id: "map", label: "Карта и адреса" },
    { id: "patriarchs", label: "Патриаршие пруды" },
    { id: "sadovaya10", label: "Большая Садовая, 10" },
    { id: "griboedov", label: "Версия «Дома Грибоедова»" },
    { id: "variete", label: "Версия «Варьете»" },
    { id: "tramyth", label: "Трамвайный миф" },
    { id: "route", label: "Маршрут 2–3 часа" },
    { id: "faq", label: "FAQ" },
  ],
  preface: (
    <>
      <p className="text-lg mb-4 text-gray-800">
        На связи команда <strong>4‑trip</strong>. Ниже — короткий ориентир по булгаковской Москве: ключевые адреса, версии спорных точек, карта и лаконичный маршрут.
      </p>
      <p className="text-gray-700">
        Материал собран как выжимка из популярных статей и путеводителей: берём проверяемое, отсекаем лишнее, оставляем то, что помогает пройти путь без путаницы.
      </p>
    </>
  ),
  content: (
    <>
      {/* Карта и адреса */}
      <section id="map" className="mb-10">
        <h2 className="text-3xl font-semibold">Карта и адреса</h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Патриаршие пруды</strong> — входы со стороны Малой Бронной и Большого Патриаршего пер.; м. Пушкинская/Тверская/Чеховская.
          </li>
          <li>
            <strong>Музей Булгакова</strong> — ул. Большая Садовая, 10, 6‑й подъезд, кв. 50; м. Маяковская/Пушкинская.
          </li>
          <li>
            <strong>«Дом Грибоедова» (версия)</strong> — Тверской бульвар, 25 (Дом Герцена); м. Тверская/Пушкинская.
          </li>
          <li>
            <strong>«Театр Варьете» (версия)</strong> — Триумфальная пл., 2 (Театр Сатиры); м. Маяковская.
          </li>
          <li>
            <strong>Чистые пруды (контекст мифа)</strong> — Чистопрудный бульвар; м. Чистые пруды/Тургеневская.
          </li>
        </ul>
        <div className="mt-4 aspect-[16/9] rounded-xl overflow-hidden">
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor:YANDEX_MAP_CONSTRUCTOR_ID&source=constructor"
            width="100%"
            height="100%"
            frameBorder={0}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Карта маршрута"
          />
        </div>
      </section>

      {/* Патриаршие пруды */}
      <section id="patriarchs" className="mt-12">
        <h2 className="text-2xl font-semibold">Патриаршие пруды</h2>
        <p>
          Место первой сцены воспринимается как камерный «амфитеатр»: диагонали дорожек дают обзор, вода гасит шум, а кромка пруда задаёт линию.
        </p>
        <p>
          Популярные путеводители отталкиваются именно отсюда: здесь проще «собрать» начало маршрута и объяснить мем‑якоря («Аннушка разлила масло») без квеста на конкретную дверь.
        </p>
      </section>

      {/* Большая Садовая, 10 */}
      <section id="sadovaya10" className="mt-12">
        <h2 className="text-2xl font-semibold">Большая Садовая, 10 — «нехорошая квартира»</h2>
        <p>
          Коммунальная планировка музея на Садовой помогает понять материальную сторону жизни автора и атмосферу времени. Это короткая, но содержательная остановка; проверьте режим работы заранее.
        </p>
        <p>
          Визит удобно совместить с переходом к Триумфальной площади, чтобы связать «квартиру» с «эстрадной сценой» в одной петле.
        </p>
      </section>

      {/* Версия «Дома Грибоедова» */}
      <section id="griboedov" className="mt-12">
        <h2 className="text-2xl font-semibold">«Дом Грибоедова» — версия на Тверском бульваре</h2>
        <p>
          В путеводителях чаще всего указывают Дом Герцена (Тверской бульвар, 25) как адрес, где в 1920‑е базировались писательские организации. Так объясняют собирательный образ «литераторского дома» в романе.
        </p>
        <p>
          На практике это удобная точка связки маршрута: от Триумфальной через Садовое к бульвару — и дальше к Пушкинской площади.
        </p>
      </section>

      {/* Версия «Варьете» */}
      <section id="variete" className="mt-12">
        <h2 className="text-2xl font-semibold">«Театр Варьете» — версии вокруг Триумфальной</h2>
        <p>
          Чаще других упоминают фасад Театра Сатиры на Триумфальной пл., 2; рядом исторически существовали эстрадные площадки. Поэтому корректно говорить «собирательный образ», а не один‑единственный адрес.
        </p>
        <p>
          Съёмочный ракурс для фото лучше подбирать в сумерках: свет вывесок и окна собирают «сцену».
        </p>
      </section>

      {/* Трамвайный миф */}
      <section id="tramyth" className="mt-12">
        <h2 className="text-2xl font-semibold">Трамвайный миф: почему путают с Патриаршими</h2>
        <p>
          В популярной версии трамвай «ходит у Патриарших», но исторические описания и схемы указывают маршруты на соседних бульварах. Для наглядности удобно сравнить с Чистопрудным бульваром, где рельсы — органичная часть ландшафта.
        </p>
      </section>

      {/* Маршрут */}
      <section id="route" className="mt-12">
        <h2 className="text-2xl font-semibold">Короткий маршрут (2–3 часа)</h2>
        <ol className="list-decimal pl-6">
          <li>Патриаршие пруды — обзор у воды, мем‑якоря для начала разговора.</li>
          <li>Переход по Малой Бронной к Большой Садовой, 10 — музей‑квартира.</li>
          <li>Садовая → Триумфальная площадь — фасад Театра Сатиры.</li>
          <li>Дальше к Тверскому бульвару, 25 — Дом Герцена (версия «Грибоедова»).</li>
          <li>Финиш у Пушкинской площади — кафе/книжные для «послесловия».</li>
        </ol>
      </section>
    </>
  ),
  faq,
  discussionId: "fourtrip/24",
};

export default articleData;
