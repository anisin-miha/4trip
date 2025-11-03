import Providers from "./providers";
import "./globals.css";
import contactInfo from "./config/contactInfo";
import Cookie from "./components/ru/Cookie";

import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

import type { Metadata } from "next";
import MailRuCounter from "./components/ru/MailRuCounter";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { GoogleAnalytics } from "@next/third-parties/google";

// Базовые метаданные/OG по умолчанию для всех страниц (можно переопределить на уровне страницы)
export const metadata: Metadata = {
  metadataBase: new URL("https://4-trip.ru"),
  title: {
    default: "Экскурсии по Подмосковью — 4-trip.ru",
    template: "%s — 4-trip.ru",
  },
  description:
    "Групповые экскурсии по Подмосковью: Парк «Патриот», Сергиев Посад и другие направления. Комфортные поездки с профессиональными гидами!",
  openGraph: {
    type: "website",
    url: "https://4-trip.ru/",
    siteName: "4-trip.ru",
    images: [
      {
        url: "https://4-trip.ru/images/tours/patriot/cathedral-hero.png",
        width: 1200,
        height: 630,
        alt: "4-trip.ru — Экскурсии по Подмосковью",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Экскурсии по Подмосковью — 4-trip.ru",
    description:
      "Групповые туры по Подмосковью: Парк «Патриот», Сергиев Посад и другие маршруты.",
    images: [
      {
        url: "https://4-trip.ru/images/tours/patriot/cathedral-hero.png",
        width: 1200,
        height: 630,
        alt: "4-trip.ru — Экскурсии по Подмосковью",
      },
    ],
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>;
};

export default async function RootLayout(props: RootLayoutProps) {
  const { children, params } = props;
  // Обрабатываем телефон один раз
  const phoneFormatted = contactInfo.phone.replace(/\s|\(|\)|-/g, "");

  // Фильтруем рабочие соцсети
  const socialLinks = Object.values(contactInfo.social).filter((link) => link);

  // Ensure that the incoming `locale` is valid
  const resolvedParams = params ? await params : undefined;

  const locale = resolvedParams?.locale ?? "ru";

  if (!hasLocale(routing.locales, locale)) {
    return (
      <html>
        <body></body>
      </html>
    );
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="keywords"
          content="групповые экскурсии Подмосковье, туры по Подмосковью, экскурсия Парк Патриот, экскурсия Сергиев Посад, автобусные туры Москва"
        />
        <link
          rel="apple-touch-icon"
          href="/favicon/web-app-manifest-192x192.webp"
        />
        <link
          rel="icon"
          type="image/webp"
          href="/favicon/favicon-96x96.webp"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.webp"
        />
        <meta name="apple-mobile-web-app-title" content="4trip" />

        <meta
          name="selfwork.ru"
          content="rcXWqSIFnuEyguSL8GZKfYnebM4JXu3iVsE4uQ8IBz7K2Gj4cD"
        />

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
        <NextIntlClientProvider>
          <Providers>
            {children}
            <Cookie />
          </Providers>
        </NextIntlClientProvider>
        <script src="//code.jivo.ru/widget/3wd3G0IExH" async></script>

        <MailRuCounter counterId="3691918" />

        <Analytics />
        <SpeedInsights />

        <GoogleAnalytics gaId="G-8ZVLE09Y04" />
      </body>
    </html>
  );
}
