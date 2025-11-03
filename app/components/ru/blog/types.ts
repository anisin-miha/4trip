import type { Metadata } from "next";
import type { ReactNode } from "react";
import type {
  FAQSectionItem,
  FAQSectionProps,
} from "@/app/components/ru/FAQSection";

export type BlogArticleLocale = "ru" | (string & {});

const BLOG_TAG_CATEGORY_DEFINITIONS = {
  theme: { label: "Тематические кластеры" },
  format: { label: "Формат материала" },
  location: { label: "Районы и ключевые локации" },
  object: { label: "Тип объекта" },
  style: { label: "Архитектурные стили" },
  era: { label: "Эпохи и периоды" },
  persona: { label: "Персоны" },
  audience: { label: "Сценарии и аудитории" },
  season: { label: "Сезон и время" },
  logistics: { label: "Логистика и активность" },
  suburb: { label: "Подмосковье" },
  marker: { label: "Темы маркеры" },
} as const;

export type BlogTagCategoryId = keyof typeof BLOG_TAG_CATEGORY_DEFINITIONS;

export type BlogTagCategory = {
  id: BlogTagCategoryId;
  label: (typeof BLOG_TAG_CATEGORY_DEFINITIONS)[BlogTagCategoryId]["label"];
};

export const BLOG_TAG_CATEGORIES: readonly BlogTagCategory[] = Object.entries(
  BLOG_TAG_CATEGORY_DEFINITIONS,
).map(([id, value]) => ({
  id: id as BlogTagCategoryId,
  label: value.label,
}));

export const BLOG_TAG_CATEGORIES_MAP: Record<
  BlogTagCategoryId,
  BlogTagCategory
> = BLOG_TAG_CATEGORIES.reduce(
  (acc, category) => {
    acc[category.id] = category;
    return acc;
  },
  {} as Record<BlogTagCategoryId, BlogTagCategory>,
);

type BlogTagDefinition = {
  label: string;
  description: string;
  categoryId: BlogTagCategoryId;
};

const BLOG_TAG_DEFINITIONS = {
  architecture: {
    label: "Архитектура",
    description: "Все про здания и стили.",
    categoryId: "theme",
  },
  "art-nouveau": {
    label: "Модерн (ар-нуво)",
    description: "Особняки в стиле модерн, работы Шехтеля.",
    categoryId: "theme",
  },
  constructivism: {
    label: "Конструктивизм и авангард",
    description: "Наркомфин, Мельников и другие объекты авангарда.",
    categoryId: "theme",
  },
  "stalin-highrises": {
    label: "Сталинские высотки",
    description: "Семь сестер и послевоенные высотки.",
    categoryId: "theme",
  },
  "moscow-metro": {
    label: "Метро",
    description: "Станции метро как музей и маршруты под землей.",
    categoryId: "theme",
  },
  estates: {
    label: "Усадьбы",
    description: "Коломенское, Царицыно, Кусково и другие усадьбы.",
    categoryId: "theme",
  },
  "major-museums": {
    label: "Музеи (большие)",
    description: "Крупные музеи и их постоянные экспозиции.",
    categoryId: "theme",
  },
  "house-museums": {
    label: "Дом-музеи",
    description: "Домашние музеи Булгакова, Толстого, Чехова и других.",
    categoryId: "theme",
  },
  parks: {
    label: "Парки и сады",
    description: "Зарядье, Горький, Музеон и другие парки.",
    categoryId: "theme",
  },
  "embankments-bridges": {
    label: "Набережные и мосты",
    description: "Маршруты вдоль реки и переходы через мосты.",
    categoryId: "theme",
  },
  "cinema-moscow": {
    label: "Москва в кино",
    description: "Кинолокации, Мосфильм, маршруты по фильмам.",
    categoryId: "theme",
  },
  "street-art": {
    label: "Стрит-арт",
    description: "Муралы и легальные площадки для уличного искусства.",
    categoryId: "theme",
  },
  "orthodox-heritage": {
    label: "Православное наследие",
    description: "Храмы, монастыри и православные святыни.",
    categoryId: "theme",
  },
  "merchant-moscow": {
    label: "Купеческая Москва",
    description: "Замоскворечье, особняки купцов и торговые ряды.",
    categoryId: "theme",
  },
  "underground-moscow": {
    label: "Подземная Москва",
    description: "Бункеры, ходы и скрытые уровни города.",
    categoryId: "theme",
  },
  "space-science": {
    label: "Наука и космос",
    description: "ВДНХ, Королев и музеи космонавтики.",
    categoryId: "theme",
  },
  "moscow-city": {
    label: "Москва-Сити",
    description: "Современный деловой центр и смотровые площадки.",
    categoryId: "theme",
  },
  vdnkh: {
    label: "ВДНХ",
    description: "Павильоны и выставки ВДНХ.",
    categoryId: "theme",
  },
  "moskva-river": {
    label: "Москворека",
    description: "Прогулки вдоль реки и переправы.",
    categoryId: "theme",
  },
  "myths-legends": {
    label: "Мифы и легенды",
    description: "Фольклорные истории и городские легенды.",
    categoryId: "theme",
  },
  "hidden-history": {
    label: "Неочевидная история",
    description: "Забытые события и малоизвестные факты.",
    categoryId: "theme",
  },
  "vanished-moscow": {
    label: "Утраченная Москва",
    description: "Снесенные и утраченные объекты столицы.",
    categoryId: "theme",
  },
  "moscow-region": {
    label: "Подмосковье",
    description: "Однодневные выезды за пределы Москвы.",
    categoryId: "theme",
  },
  route: {
    label: "Маршрут",
    description: "Пошаговые прогулки и маршруты.",
    categoryId: "format",
  },
  "day-itinerary": {
    label: "Маршрут одного дня",
    description: "План на насыщенный день.",
    categoryId: "format",
  },
  "micro-route": {
    label: "Микро-маршрут",
    description: "Маршруты на 60-90 минут.",
    categoryId: "format",
  },
  "museum-guide": {
    label: "Гид по музею",
    description: "Подробные обзоры музейных экспозиций.",
    categoryId: "format",
  },
  listicle: {
    label: "Подборка или топ",
    description: "Списки и подборки лучших мест.",
    categoryId: "format",
  },
  "place-history": {
    label: "История места",
    description: "Происхождение и трансформация локаций.",
    categoryId: "format",
  },
  biography: {
    label: "Биография или персона",
    description: "Истории людей и их связей с Москвой.",
    categoryId: "format",
  },
  legend: {
    label: "Легенда",
    description: "Сюжеты о городских легендах.",
    categoryId: "format",
  },
  mythbusting: {
    label: "Развенчание мифа",
    description: "Проверяем и опровергаем популярные мифы.",
    categoryId: "format",
  },
  "photo-walk": {
    label: "Фоторуководство",
    description: "Маршруты с лучшими точками для съемки.",
    categoryId: "format",
  },
  "family-route": {
    label: "Семейный маршрут",
    description: "Прогулки и форматы для семей с детьми.",
    categoryId: "format",
  },
  "food-route": {
    label: "Гастро-маршрут",
    description: "Маршруты и подборки для любителей гастрономии.",
    categoryId: "format",
  },
  "events-now": {
    label: "Афиша или что сейчас",
    description: "Актуальные события, выставки и активности.",
    categoryId: "format",
  },
  kremlin: {
    label: "Кремль",
    description: "Истории и маршруты в Кремле и рядом.",
    categoryId: "location",
  },
  "kitai-gorod": {
    label: "Китай-город",
    description: "Прогулки по историческому кварталу.",
    categoryId: "location",
  },
  zaryadye: {
    label: "Зарядье",
    description: "Маршруты и гиды по парку Зарядье.",
    categoryId: "location",
  },
  "old-arbat": {
    label: "Старый Арбат",
    description: "Главная туристическая улица и ее переулки.",
    categoryId: "location",
  },
  "new-arbat": {
    label: "Новый Арбат",
    description: "Современный Арбат и окрестности.",
    categoryId: "location",
  },
  ostozhenka: {
    label: "Остоженка",
    description: "Золотая миля и архитектура Остоженки.",
    categoryId: "location",
  },
  prechistenka: {
    label: "Пречистенка",
    description: "Особняки и музеи на Пречистенке.",
    categoryId: "location",
  },
  zamoskvorechye: {
    label: "Замоскворечье",
    description: "Истории купеческого района.",
    categoryId: "location",
  },
  bersenevskaya: {
    label: "Берсеневская набережная",
    description: "Прогулки вдоль Берсеневской набережной.",
    categoryId: "location",
  },
  taganka: {
    label: "Таганка",
    description: "Литературная и театральная Таганка.",
    categoryId: "location",
  },
  shabolovka: {
    label: "Шаболовка",
    description: "Район конструктивизма и Шуховская башня.",
    categoryId: "location",
  },
  khamovniki: {
    label: "Хамовники",
    description: "Старинные улицы и музеи Хамовников.",
    categoryId: "location",
  },
  "nikitsky-boulevard": {
    label: "Никитский бульвар",
    description: "Бульварное кольцо и окружающие переулки.",
    categoryId: "location",
  },
  tverskaya: {
    label: "Тверская",
    description: "Главная улица и ее история.",
    categoryId: "location",
  },
  "vorobyovy-gory": {
    label: "Воробьевы горы",
    description: "Смотровые площадки и природные тропы.",
    categoryId: "location",
  },
  "patriarch-ponds": {
    label: "Патриаршие пруды",
    description: "Литературный район и прогулки у пруда.",
    categoryId: "location",
  },
  "moscow-city-district": {
    label: "Москва-Сити (район)",
    description: "Деловой центр и его инфраструктура.",
    categoryId: "location",
  },
  "vdnkh-area": {
    label: "ВДНХ (район)",
    description: "Территория вокруг ВДНХ и Ботанического сада.",
    categoryId: "location",
  },
  kolomenskoe: {
    label: "Коломенское",
    description: "Исторический парк-музей Коломенское.",
    categoryId: "location",
  },
  tsaritsyno: {
    label: "Царицыно",
    description: "Дворцово-парковый ансамбль Царицыно.",
    categoryId: "location",
  },
  kuskovo: {
    label: "Кусково",
    description: "Усадьба и парк Кусково.",
    categoryId: "location",
  },
  novodevichy: {
    label: "Новодевичий монастырь",
    description: "Монастырь и соседние маршруты.",
    categoryId: "location",
  },
  sokolniki: {
    label: "Сокольники",
    description: "Парк и район Сокольники.",
    categoryId: "location",
  },
  izmailovo: {
    label: "Измайлово",
    description: "История района и природные зоны.",
    categoryId: "location",
  },
  "house-museum": {
    label: "Дом-музей",
    description: "Небольшие музеи в исторических домах.",
    categoryId: "object",
  },
  estate: {
    label: "Усадьба",
    description: "Усадебные ансамбли и парки.",
    categoryId: "object",
  },
  monastery: {
    label: "Монастырь",
    description: "Монастырские комплексы и их история.",
    categoryId: "object",
  },
  cathedral: {
    label: "Храм или собор",
    description: "Православные храмы и соборы.",
    categoryId: "object",
  },
  palace: {
    label: "Дворец",
    description: "Дворцовые ансамбли и резиденции.",
    categoryId: "object",
  },
  "vdnkh-pavilion": {
    label: "Павильон ВДНХ",
    description: "Павильоны и объекты на ВДНХ.",
    categoryId: "object",
  },
  tower: {
    label: "Башня",
    description: "Башни и высотные доминанты.",
    categoryId: "object",
  },
  bridge: {
    label: "Мост",
    description: "Мосты и переправы столицы.",
    categoryId: "object",
  },
  embankment: {
    label: "Набережная",
    description: "Прогулочные зоны вдоль воды.",
    categoryId: "object",
  },
  park: {
    label: "Парк",
    description: "Парковые пространства и скверы.",
    categoryId: "object",
  },
  "market-foodhall": {
    label: "Рынок или гастромаркет",
    description: "Рынки и гастрономические пространства.",
    categoryId: "object",
  },
  bunker: {
    label: "Бункер",
    description: "Подземные сооружения и укрытия.",
    categoryId: "object",
  },
  "film-studio": {
    label: "Киностудия",
    description: "Киностудии и съемочные площадки.",
    categoryId: "object",
  },
  museum: {
    label: "Музей",
    description: "Любые музейные площадки.",
    categoryId: "object",
  },
  "old-russian": {
    label: "Древнерусская архитектура",
    description: "Памятники древнерусского зодчества.",
    categoryId: "style",
  },
  baroque: {
    label: "Барокко",
    description: "Архитектура эпохи барокко.",
    categoryId: "style",
  },
  classicism: {
    label: "Классицизм",
    description: "Классические архитектурные формы.",
    categoryId: "style",
  },
  "empire-style": {
    label: "Ампир",
    description: "Архитектура стиля ампир.",
    categoryId: "style",
  },
  eclecticism: {
    label: "Эклектика",
    description: "Эклектичные ансамбли и стили.",
    categoryId: "style",
  },
  "art-nouveau-style": {
    label: "Модерн (стиль)",
    description: "Архитектура модерна.",
    categoryId: "style",
  },
  neoclassicism: {
    label: "Неоклассицизм",
    description: "Возвращение к классическим формам в архитектуре.",
    categoryId: "style",
  },
  "constructivism-style": {
    label: "Конструктивизм (стиль)",
    description: "Архитектура конструктивизма и авангарда.",
    categoryId: "style",
  },
  "stalin-empire": {
    label: "Сталинский ампир",
    description: "Монументальная архитектура сталинской эпохи.",
    categoryId: "style",
  },
  brutalism: {
    label: "Брутализм",
    description: "Советский модернизм и бруталистские объекты.",
    categoryId: "style",
  },
  "hi-tech": {
    label: "Хай-тек",
    description: "Современная архитектура в стиле хай-тек.",
    categoryId: "style",
  },
  contemporary: {
    label: "Современная архитектура",
    description: "Архитектура XXI века.",
    categoryId: "style",
  },
  medieval: {
    label: "Средневековье",
    description: "События и объекты средневековой Москвы.",
    categoryId: "era",
  },
  c17: {
    label: "XVII век",
    description: "Архитектура и события XVII века.",
    categoryId: "era",
  },
  c18: {
    label: "XVIII век",
    description: "Материалы об XVIII столетии.",
    categoryId: "era",
  },
  c19: {
    label: "XIX век",
    description: "Локации и истории XIX века.",
    categoryId: "era",
  },
  "turn-of-century": {
    label: "Рубеж веков",
    description: "Поздний XIX и ранний XX век.",
    categoryId: "era",
  },
  "1920s-30s": {
    label: "1920-30-е",
    description: "Авангард и конструктивизм межвоенного периода.",
    categoryId: "era",
  },
  "stalin-era": {
    label: "Сталинская эпоха",
    description: "Жизнь и строительство при Сталине.",
    categoryId: "era",
  },
  "postwar-ussr": {
    label: "Оттепель и поздний СССР",
    description: "Послевоенное развитие и поздний СССР.",
    categoryId: "era",
  },
  "contemporary-era": {
    label: "Современность",
    description: "События и объекты новейшего времени.",
    categoryId: "era",
  },
  "mikhail-bulgakov": {
    label: "Михаил Булгаков",
    description: "Локации и истории, связанные с Булгаковым.",
    categoryId: "persona",
  },
  "alexander-pushkin": {
    label: "Александр Пушкин",
    description: "Места, связанные с Пушкиным.",
    categoryId: "persona",
  },
  "leo-tolstoy": {
    label: "Лев Толстой",
    description: "Места Толстого в Москве и области.",
    categoryId: "persona",
  },
  "anton-chekhov": {
    label: "Антон Чехов",
    description: "Истории о Чехове и его окружении.",
    categoryId: "persona",
  },
  "fedor-shekhtel": {
    label: "Федор Шехтель",
    description: "Архитектура и наследие Шехтеля.",
    categoryId: "persona",
  },
  "konstantin-melnikov": {
    label: "Константин Мельников",
    description: "Объекты и наследие архитектора Мельникова.",
    categoryId: "persona",
  },
  "vladimir-shukhov": {
    label: "Владимир Шухов",
    description: "Инженерные проекты Шухова.",
    categoryId: "persona",
  },
  "sergei-korolev": {
    label: "Сергей Королев",
    description: "Космическое наследие Королева.",
    categoryId: "persona",
  },
  "yakov-bruce": {
    label: "Яков Брюс",
    description: "Мистические истории и легенды о Брюсе.",
    categoryId: "persona",
  },
  "pavel-tretyakov": {
    label: "Павел Третьяков",
    description: "Коллекционер и его вклад в культуру.",
    categoryId: "persona",
  },
  "catherine-ii": {
    label: "Екатерина II",
    description: "Эпоха Екатерины и ее объекты.",
    categoryId: "persona",
  },
  napoleon: {
    label: "Наполеон",
    description: "Присутствие Наполеона в Москве и события 1812 года.",
    categoryId: "persona",
  },
  "with-kids": {
    label: "С детьми",
    description: "Маршруты и активности для детей.",
    categoryId: "audience",
  },
  "first-time": {
    label: "Для новичков в Москве",
    description: "Идеи для первого знакомства с городом.",
    categoryId: "audience",
  },
  "for-geeks": {
    label: "Для гиков",
    description: "Нетипичные маршруты и инженерные локации.",
    categoryId: "audience",
  },
  romantic: {
    label: "Романтическое",
    description: "Прогулки и идеи для свиданий.",
    categoryId: "audience",
  },
  "photo-spots": {
    label: "Фотолокации",
    description: "Лучшие места для съемки.",
    categoryId: "audience",
  },
  accessible: {
    label: "Безбарьерно",
    description: "Маршруты без архитектурных барьеров.",
    categoryId: "audience",
  },
  budget: {
    label: "Бюджетно",
    description: "Недорогие маршруты и активности.",
    categoryId: "audience",
  },
  premium: {
    label: "Премиум",
    description: "Маршруты и услуги премиум-класса.",
    categoryId: "audience",
  },
  "rainy-day": {
    label: "В дождь",
    description: "Чем заняться в плохую погоду.",
    categoryId: "audience",
  },
  "hot-day": {
    label: "В жару",
    description: "Идеи на летнюю жару.",
    categoryId: "audience",
  },
  "winter-friendly": {
    label: "Зимой",
    description: "Маршруты и активности зимой.",
    categoryId: "audience",
  },
  "night-walk": {
    label: "Ночью",
    description: "Ночные прогулки и маршруты.",
    categoryId: "audience",
  },
  winter: {
    label: "Зима",
    description: "Зимние сценарии и подборки.",
    categoryId: "season",
  },
  spring: {
    label: "Весна",
    description: "Весенние прогулки и маршруты.",
    categoryId: "season",
  },
  summer: {
    label: "Лето",
    description: "Летние идеи для путешествий.",
    categoryId: "season",
  },
  autumn: {
    label: "Осень",
    description: "Осенние маршруты и советы.",
    categoryId: "season",
  },
  sunrise: {
    label: "Рассвет",
    description: "Лучшие точки встречи рассвета.",
    categoryId: "season",
  },
  sunset: {
    label: "Закат",
    description: "Где встречать закат в городе.",
    categoryId: "season",
  },
  evening: {
    label: "Вечер",
    description: "Вечерние прогулки и развлечения.",
    categoryId: "season",
  },
  weekend: {
    label: "Выходные",
    description: "Идеи на уикенд.",
    categoryId: "season",
  },
  "on-foot": {
    label: "Пешком",
    description: "Маршруты и прогулки пешком.",
    categoryId: "logistics",
  },
  "by-metro": {
    label: "Метро",
    description: "Маршруты с упором на метро и пересадки.",
    categoryId: "logistics",
  },
  "by-bike": {
    label: "Велопрогулка",
    description: "Маршруты на велосипеде.",
    categoryId: "logistics",
  },
  "river-cruise": {
    label: "Речной трамвай",
    description: "Прогулки на речном транспорте.",
    categoryId: "logistics",
  },
  "retro-tram": {
    label: "Ретро-трамвай",
    description: "Экскурсии на ретро-трамвае.",
    categoryId: "logistics",
  },
  "by-car": {
    label: "Авто",
    description: "Маршруты на машине.",
    categoryId: "logistics",
  },
  "sidecar-tour": {
    label: "Мото или сайдкар",
    description: "Поездки на мотоцикле и в сайдкаре.",
    categoryId: "logistics",
  },
  rooftop: {
    label: "Крыши",
    description: "Смотровые площадки и крыши.",
    categoryId: "logistics",
  },
  arkhangelskoye: {
    label: "Архангельское",
    description: "Маршруты по усадьбе Архангельское.",
    categoryId: "suburb",
  },
  peredelkino: {
    label: "Переделкино",
    description: "Литературное Переделкино и окрестности.",
    categoryId: "suburb",
  },
  korolev: {
    label: "Королев",
    description: "Космический город Королев и Подлипки.",
    categoryId: "suburb",
  },
  "dmitrov-olgovo": {
    label: "Дмитров и Ольгово",
    description: "Маршруты по Дмитрову и окрестностям.",
    categoryId: "suburb",
  },
  syany: {
    label: "Сьяны",
    description: "Сьяновские каменоломни и подземелья.",
    categoryId: "suburb",
  },
  smerdyachye: {
    label: "Шатура и Смердячье",
    description: "Природные маршруты по Шатуре и озеру Смердячье.",
    categoryId: "suburb",
  },
  "sergiev-posad": {
    label: "Сергиев Посад",
    description: "Однодневные поездки в Сергиев Посад.",
    categoryId: "suburb",
  },
  monino: {
    label: "Монино",
    description: "Авиационный музей в Монино.",
    categoryId: "suburb",
  },
  "industrial-heritage": {
    label: "Индустриальное наследие",
    description: "Заводы, фабрики и промышленная архитектура.",
    categoryId: "marker",
  },
  "urban-nature": {
    label: "Экология и зеленые зоны",
    description: "Парки, экотропы и природные маршруты.",
    categoryId: "marker",
  },
  food: {
    label: "Гастрономия",
    description: "Кафе, рынки и гастрономические маршруты.",
    categoryId: "marker",
  },
  "public-art": {
    label: "Искусство в городе",
    description: "Публичное искусство и арт-объекты.",
    categoryId: "marker",
  },
  "tunnels-bunkers": {
    label: "Подземные ходы и бункеры",
    description: "Тоннели, укрытия и подземные маршруты.",
    categoryId: "marker",
  },
  folklore: {
    label: "Фольклор и суеверия",
    description: "Фольклорные сюжеты и суеверия.",
    categoryId: "marker",
  },
} as const;

type BlogTagDefinitions = typeof BLOG_TAG_DEFINITIONS;

export type BlogTagSlug = keyof BlogTagDefinitions;

type BlogTagDefinitionValue = BlogTagDefinitions[BlogTagSlug];

export type BlogTag = BlogTagDefinitionValue & {
  slug: BlogTagSlug;
  category: BlogTagCategory;
};

export const BLOG_TAGS: readonly BlogTag[] = (
  Object.entries(BLOG_TAG_DEFINITIONS) as Array<
    [BlogTagSlug, BlogTagDefinitionValue]
  >
).map(([slug, definition]) => ({
  slug,
  ...definition,
  category: BLOG_TAG_CATEGORIES_MAP[definition.categoryId],
}));

export const BLOG_TAGS_MAP: Record<BlogTagSlug, BlogTag> = BLOG_TAGS.reduce(
  (acc, tag) => {
    acc[tag.slug] = tag;
    return acc;
  },
  {} as Record<BlogTagSlug, BlogTag>,
);

export const BLOG_TAGS_BY_CATEGORY: Record<
  BlogTagCategoryId,
  readonly BlogTag[]
> = BLOG_TAGS.reduce(
  (acc, tag) => {
    const list = acc[tag.category.id] ?? [];
    acc[tag.category.id] = [...list, tag];
    return acc;
  },
  {} as Record<BlogTagCategoryId, readonly BlogTag[]>,
);

export type BlogArticleTocItem = {
  id: string;
  label: string;
  children?: BlogArticleTocItem[];
};

export type BlogArticleBadge = {
  prefix: string;
  text: string;
};

export type BlogArticleStructuredData = Record<string, unknown>;

export type BlogArticleSummary = {
  slug: string;
  title: string;
  url: string;
  description: string;
  excerpt: string;
  locale: BlogArticleLocale;
  publishedAt: string;
  updatedAt: string;
  tags: readonly BlogTag[];
  coverImage?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  badge?: BlogArticleBadge;
};

type BlogArticleFaq = Omit<FAQSectionProps, "items"> & {
  items: readonly FAQSectionItem[];
};

export type BlogArticleData = BlogArticleSummary & {
  metadata: Metadata;
  toc?: BlogArticleTocItem[];
  structuredData: BlogArticleStructuredData[];
  discussionId?: string;
  preface?: ReactNode;
  content: ReactNode;
  afterContent?: ReactNode;
  relatedArticles?: {
    title?: string;
    limit?: number;
    slugs?: readonly string[];
  };
  faq?: BlogArticleFaq;
};
