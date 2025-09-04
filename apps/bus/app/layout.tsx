import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://4-bus.ru"),
  title: {
    default: "4-bus — Заказ автобусов",
    template: "%s — 4-bus",
  },
  description: "Заказ автобусов и микроавтобусов в Москве и МО.",
  openGraph: {
    type: "website",
    url: "https://4-bus.ru/",
    siteName: "4-bus",
    images: [
      {
        url: "https://4-trip.ru/images/cover.png",
        width: 1200,
        height: 630,
        alt: "4-bus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "4-bus — Заказ автобусов",
    description: "Заказ автобусов и микроавтобусов в Москве и МО.",
    images: ["https://4-trip.ru/images/cover.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
