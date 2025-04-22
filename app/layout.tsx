import type { Metadata } from "next";
import Providers from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: 'Экскурсия в Парк «Патриот» | Путешествия на автобусе в Москву',
  description:
    'Присоединяйтесь к уникальной экскурсии на автобусе в Парк «Патриот». Посетите музей Дорога памяти, храм Вооружённых сил, смотровую площадку и насладитесь полевой кухней. Забронируйте тур по субботам!',
  keywords:
    'экскурсия Парк «Патриот», тур Парк «Патриот», экскурсия на автобусе, музей Дорога памяти, храм Вооружённых сил, полевая кухня, экскурсия из Москвы, исторический тур, семейная экскурсия',
  openGraph: {
    title: 'Экскурсия в Парк «Патриот» | Путешествия на автобусе в Москву',
    description:
      'Присоединяйтесь к уникальной экскурсии на автобусе в Парк «Патриот». Посетите музей Дорога памяти, храм Вооружённых сил, смотровую площадку и насладитесь полевой кухней. Забронируйте тур по субботам!',
    images: ["/images/patriot/park-patriot-hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: 'Экскурсия в Парк «Патриот» | Путешествия на автобусе в Москву',
    description:
      'Присоединяйтесь к уникальной экскурсии на автобусе в Парк «Патриот». Посетите музей Дорога памяти, храм Вооружённых сил, смотровую площадку и насладитесь полевой кухней. Забронируйте тур по субботам!',
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
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/favicon/web-app-manifest-192x192.png" />

        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="4trip" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
