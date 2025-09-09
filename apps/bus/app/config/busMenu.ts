export type MenuItem = {
  path: string;
  title: string;
};

export type MenuCategory = {
  title: string;
  items: MenuItem[];
};

// Сформировано из README.bus.md — раздел "Контент‑план (SEO‑кластеры)".
export const busMenu: MenuCategory[] = [
  {
    title: "Главное",
    items: [
      { path: "/", title: "Главная" },
      { path: "/avtopark", title: "Автопарк" },
      { path: "/tarify", title: "Тарифы и цены" },
      { path: "/usloviya-arendy", title: "Условия аренды" },
      { path: "/oplata", title: "Оплата" },
      { path: "/faq", title: "FAQ" },
      { path: "/otzyvy", title: "Отзывы" },
      { path: "/contacts", title: "Контакты" },
    ],
  },
  {
    title: "Услуги и аренда",
    items: [
      { path: "/dlya-shkolnikov", title: "Для школьников" },
      { path: "/na-vypusknoi", title: "На выпускной" },
      { path: "/ehkskursii-dlya-shkolnikov", title: "Экскурсии для школьников" },
      { path: "/svadby", title: "Свадьбы" },
      { path: "/transfery", title: "Трансферы" },
      { path: "/v-aeroport", title: "Трансфер в аэропорт" },
      { path: "/miniven-v-aeroport", title: "Минивэн в аэропорт" },
      { path: "/korporativnyj-transport", title: "Корпоративный транспорт" },
      { path: "/perevozka-rabochih", title: "Перевозка рабочих" },
      { path: "/razvozka-sotrudnikov", title: "Развозка сотрудников" },
      { path: "/dlya-turoperatorov", title: "Для туроператоров" },
      { path: "/dlya-ehkskursij", title: "Экскурсии (общая)" },
      { path: "/mezhdunarodnyj-avtobus", title: "Международный автобус" },
      { path: "/podmoskovie", title: "Подмосковье" },
      { path: "/malo-mobilnye", title: "Перевозка маломобильных пассажиров" },
    ],
  },
  {
    title: "Города",
    items: [
      { path: "/moskva", title: "Москва" },
      { path: "/khimki", title: "Химки" },
      { path: "/balashiha", title: "Балашиха" },
      { path: "/odintsovo", title: "Одинцово" },
      { path: "/podolsk", title: "Подольск" },
      { path: "/korolev", title: "Королёв" },
      { path: "/reutov", title: "Реутов" },
      { path: "/mytischi", title: "Мытищи" },
      { path: "/lyubertsy", title: "Люберцы" },
      { path: "/dolgoprudny", title: "Долгопрудный" },
      { path: "/vidnoe", title: "Видное" },
      { path: "/zhukovskiy", title: "Жуковский" },
      { path: "/krasnogorsk", title: "Красногорск" },
    ],
  },
  {
    title: "Аэропорты и вокзалы",
    items: [
      { path: "/sheremetyevo", title: "Шереметьево" },
      { path: "/domodedovo", title: "Домодедово" },
      { path: "/vnukovo", title: "Внуково" },
      { path: "/zhukovsky", title: "Жуковский" },
      { path: "/kazansky-vokzal", title: "Казанский вокзал" },
      { path: "/leningradsky-vokzal", title: "Ленинградский вокзал" },
    ],
  },
  {
    title: "По количеству мест",
    items: [
      { path: "/na-25-mest", title: "На 25 мест" },
      { path: "/na-30-mest", title: "На 30 мест" },
      { path: "/na-35-mest", title: "На 35 мест" },
      { path: "/na-40-mest", title: "На 40 мест" },
      { path: "/na-45-mest", title: "На 45 мест" },
      { path: "/na-50-mest", title: "На 50 мест" },
      { path: "/na-55-mest", title: "На 55 мест" },
      { path: "/na-60-mest", title: "На 60 мест" },
    ],
  },
  {
    title: "Тип транспорта",
    items: [
      { path: "/arenda-mikroavtobusa", title: "Микроавтобусы" },
      { path: "/miniven", title: "Минивэны" },
      { path: "/avtobusy", title: "Автобусы" },
      { path: "/modeli", title: "Конкретные модели" },
    ],
  },
  {
    title: "Полезное",
    items: [
      { path: "/blog", title: "Статьи и гайды" },
      { path: "/docs", title: "Документы и шаблоны" },
      { path: "/policies", title: "Политики и правила" },
      { path: "/cases", title: "Кейсы и клиенты" },
    ],
  },
  {
    title: "Инструменты",
    items: [
      { path: "/calc", title: "Калькулятор стоимости" },
      { path: "/status-zakaza", title: "Статус заказа" },
      { path: "/akcii", title: "Акции и скидки" },
    ],
  },
  {
    title: "Ещё разделы",
    items: [
      { path: "/geo", title: "Районы и города (хаб)" },
      { path: "/aeroporty-i-vokzaly", title: "Аэропорты и вокзалы (хаб)" },
      { path: "/ploshchadki-iventy", title: "Площадки и события" },
      { path: "/sla", title: "Гарантии и SLA" },
      { path: "/kak-schitaetsya-cena", title: "Как мы считаем цену" },
      { path: "/bezopasnost", title: "Безопасность и подготовка" },
      { path: "/downloads", title: "Центр загрузок" },
    ],
  },
];
