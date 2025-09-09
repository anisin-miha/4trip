const contactInfo = {
  // Основные контакты
  phone: "+7 (905) 503-21-45",
  email: "sen4urovs@yandex.ru",
  address: "Москва, Россия",

  // Социальные сети/мессенджеры
  social: {
    telegram: "https://t.me/fourtrip",
  },

  // Прочие полезные ссылки
  links: {
    seryoga_tg: "https://t.me/chetverochka_ya",
  },

  // Реквизиты исполнителя (для оферты/возвратов)
  performer: {
    fullName: "Сенчуров Сергей Сергеевич",
    inn: "325507040995",
  },

  // Настройки сайта и юридические параметры, чтобы не тащить .env
  site: {
    url: "https://4-trip.ru",
    brand: "4-trip.ru",
    privacyPath: "/privacy-policy",
  },
  policy: {
    refundProcessingDays: 10,
    freeCancelHours: 72,
    lateCancelRetentionPercent: "100%",
    offerPublishedAt: new Date().toLocaleDateString("ru-RU"),
  },
} as const;

export default contactInfo;
