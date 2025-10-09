// configs/tours/sergiev-posad-tour.ts

// configs/tours/sergiev-posad-tour-metadata.ts

import { Metadata } from "next";
import { createMeetingPoint } from "./helpers";

export const sergievPosadTourMetadata: Metadata = {
  title: "Экскурсия в Сергиев Посад | Автобусные туры из Москвы",
  description:
    "Откройте духовное наследие России в Сергиевом Посаде. Посетите Троице-Сергиеву лавру и музей фарфора в одном туре.",
  keywords:
    "Сергиев Посад, экскурсия Сергиев Посад, автобусный тур, Троице-Сергиева лавра, музей фарфора, тур из Москвы",
  openGraph: {
    title: "Экскурсия в Сергиев Посад | Автобусные туры из Москвы",
    description:
      "Откройте для себя духовный центр России — Сергиев Посад. Тур с посещением Лавры и музея фарфора.",
    images: ["/images/tours/sergiev_posad/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Экскурсия в Сергиев Посад",
    description:
      "Автобусная экскурсия в Сергиев Посад с посещением Троице-Сергиевой Лавры и музея фарфора.",
    images: ["/images/tours/sergiev_posad/hero.png"],
  },
  icons: {
    // icon: "/images/4trip-logo-black.svg",
  },
};

const sergievPosadMeetingPoint = createMeetingPoint({
  mapSrc:
    "https://yandex.ru/map-widget/v1/?ll=38.126953,56.315941&z=14&pt=38.126953,56.315941,pm2rdm",
  type: "Групповая сборная",
  timeSlots: ["09:00"],
  duration: "около 8 ч.",
  address: "метро Комсомольская, выход к Ленинградскому вокзалу",
  groupSize: "До 30 человек",
  forWhom: "Можно с детьми",
  language: "Русский",
  price: "3 500 ₽ с человека",
});

export const sergievPosadTour = {
  slug: "sergiev-posad",
  title: "Сергиев Посад",
  location: "Сергиев Посад, Московская область",
  city: "Москва",
  price: 3500,
  duration: sergievPosadMeetingPoint.duration,
  languages: sergievPosadMeetingPoint.language
    ? [sergievPosadMeetingPoint.language]
    : undefined,
  hero: {
    image: "/images/tours/sergiev_posad/hero.png",
    description:
      "Откройте для себя духовный центр России и прикоснитесь к великим традициям русского монашества",
  },
  attractions: [
    {
      image: "/images/tours/sergiev_posad/Trinity-Lavra-of-St.-Sergius.png",
      alt: "Интерьер Троице-Сергиевой лавры",
      title: "Троице-Сергиева лавра",
      description: [
        "Главная святыня города, основанная преподобным Сергием Радонежским в 14 веке.",
        "Подлинные фрески Андрея Рублева, древние колокола и духовная атмосфера.",
      ],
    },
    {
      image: "/images/tours/sergiev_posad/Porcelain-Factory-and-Museum.png",
      alt: "Музей фарфора",
      title: "Фарфоровый завод и музей",
      description: [
        "Посетим легендарный завод Императорского фарфора, узнаем о процессе создания изящных сервизов.",
        "Посмотрим коллекции 18–20 веков.",
      ],
    },
  ],
  learnMore: [
    { title: "", text: "историю основания Лавры" },
    { title: "", text: "секреты древней росписи Андрея Рублева" },
    { title: "", text: "процесс производства фарфора" },
    { title: "", text: "роль Сергия Радонежского в русской истории" },
    { title: "", text: "какие легенды окружают монастырь" },
    { title: "", text: "современную жизнь монахов и традиции" },
  ],
  details: [
    "дети до 7 лет могут путешествовать в составе сборной группы только по согласованию;",
    "несовершеннолетние дети (с 7 до 18 лет) участвуют в сборных группах только в сопровождении своих законных представителей;",
    "транспортное обслуживание по программе: автобус туристического класса. При группе менее 24 человек предоставляется микроавтобус туристического класса;",
    "одеваемся по погоде;",
    "фотосъемка разрешена.",
  ],
  meetingPoint: sergievPosadMeetingPoint,
  gallery: [
    {
      src: "/images/tours/sergiev_posad/gallery1.png",
      alt: "Галерея 1 Сергиев Посад",
    },
    {
      src: "/images/tours/sergiev_posad/gallery2.png",
      alt: "Галерея 2 Сергиев Посад",
    },
    {
      src: "/images/tours/sergiev_posad/gallery3.png",
      alt: "Галерея 3 Сергиев Посад",
    },
    {
      src: "/images/tours/sergiev_posad/gallery4.png",
      alt: "Галерея 4 Сергиев Посад",
    },
  ],
  faq: [
    {
      question: "Сколько длится экскурсия?",
      answer: "Экскурсия длится примерно 8 часов, включая переезд.",
    },
    {
      question: "Включен ли трансфер?",
      answer:
        'Да, автобус от метро "Комсомольская" до Сергиева Посада и обратно включен.',
    },
    {
      question: "Можно ли взять с собой детей?",
      answer:
        "Экскурсия подходит для всей семьи, дети от 7 лет в сопровождении взрослых.",
    },
  ],
};

export const sergievPosadTourWithMeta = {
  ...sergievPosadTour,
  metadata: sergievPosadTourMetadata,
};
