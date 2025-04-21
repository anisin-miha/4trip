import type { Metadata } from "next";
import Providers from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Экскурсия в Парк Патриот | Путешествия на автобусе в Москву",
  description:
    "Присоединяйтесь к уникальной экскурсии на автобусе в Парк Патриот. Посетите музей Дорога памяти, храм Вооруженных сил, смотровую площадку и насладитесь полевой кухней. Забронируйте тур по субботам!",
  keywords:
    "экскурсия Парк Патриот, тур Парк Патриот, экскурсия на автобусе, музей Дорога памяти, храм Вооруженных сил, полевая кухня, экскурсия из Москвы, исторический тур, семейная экскурсия",
  openGraph: {
    title: "Экскурсия в Парк Патриот | Путешествия на автобусе в Москву",
    description:
      "Присоединяйтесь к уникальной экскурсии на автобусе в Парк Патриот. Посетите музей Дорога памяти, храм Вооруженных сил, смотровую площадку и насладитесь полевой кухней. Забронируйте тур по субботам!",
    images: ["/images/patriot/park-patriot-hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Экскурсия в Парк Патриот | Путешествия на автобусе в Москву",
    description:
      "Присоединяйтесь к уникальной экскурсии на автобусе в Парк Патриот. Посетите музей Дорога памяти, храм Вооруженных сил, смотровую площадку и насладитесь полевой кухней. Забронируйте тур по субботам!",
    images: ["/images/patriot/park-patriot-hero.jpg"],
  },
  icons: {
    icon: "/images/4trip-logo-black.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
