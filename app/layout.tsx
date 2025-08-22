// import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import contactInfo from "./config/contactInfo";
import Cookie from "./components/Cookie";

// // Актуальная мета для главной страницы
// export const metadata: Metadata = {
//   title: "Экскурсии по Подмосковью — групповые туры от 4-trip.ru",
//   description:
//     "Групповые экскурсии по Подмосковью: Парк «Патриот», Сергиев Посад и другие направления. Комфортные поездки с профессиональными гидами!",
//   keywords:
//     "групповые экскурсии Подмосковье, туры по Подмосковью, экскурсия Парк Патриот, экскурсия Сергиев Посад, автобусные туры Москва",
//   openGraph: {
//     title: "Экскурсии по Подмосковью — 4-trip.ru",
//     description:
//       "Групповые туры по Подмосковью от 4-trip.ru: увлекательные маршруты, профессиональные гиды, комфортные поездки.",
//     url: "https://4-trip.ru/",
//     type: "website",
//     images: [
//       {
//         url: "https://4-trip.ru/images/cover.png",
//         width: 1200,
//         height: 630,
//         alt: "4-trip.ru — Экскурсии по Подмосковью",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Экскурсии по Подмосковью — 4-trip.ru",
//     description:
//       "Групповые туры по Подмосковью: Парк «Патриот», Сергиев Посад и другие маршруты.",
//     images: [
//       {
//         url: "https://4-trip.ru/images/cover.png",
//         width: 1200,
//         height: 630,
//         alt: "4-trip.ru — Экскурсии по Подмосковью",
//       },
//     ],
//   },
//   icons: {
//     icon: "/images/4trip-logo-black.svg",
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Обрабатываем телефон один раз
  const phoneFormatted = contactInfo.phone.replace(/\s|\(|\)|-/g, "");

  // Фильтруем рабочие соцсети
  const socialLinks = Object.values(contactInfo.social).filter(
    (link) => link && link !== "#",
  );

  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="keywords"
          content="групповые экскурсии Подмосковье, туры по Подмосковью, экскурсия Парк Патриот, экскурсия Сергиев Посад, автобусные туры Москва"
        />
        <link
          rel="apple-touch-icon"
          href="/favicon/web-app-manifest-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="4trip" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "4-trip.ru",
                url: "https://4-trip.ru/",
                logo: "https://4-trip.ru/images/logo.png",
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: phoneFormatted,
                  contactType: "customer service",
                  areaServed: "RU",
                  availableLanguage: ["Russian"],
                },
                sameAs: socialLinks,
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                url: "https://4-trip.ru/",
                name: "Экскурсии по Подмосковью — 4-trip.ru",
                description:
                  "Групповые экскурсии по Подмосковью: Парк «Патриот», Сергиев Посад и другие направления. Комфортные поездки с профессиональными гидами!",
                inLanguage: "ru",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://4-trip.ru/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
        <Cookie />
        <script src="//code.jivo.ru/widget/3wd3G0IExH" async></script>
      </body>
    </html>
  );
}
