import "./globals.css";
import type { Metadata } from "next";
import { Footer } from "@4trip/shared-ui";
import { BusSidebar } from "./components/BusSidebar";

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
        url: "https://4-trip.ru/images/patriot/cathedral-hero.png",
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
    images: ["https://4-trip.ru/images/patriot/cathedral-hero.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="container mx-auto px-4 pt-8 md:pt-10 pb-4">
          <div className="flex gap-6">
            <BusSidebar />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
        <Footer project="bus" />
      </body>
    </html>
  );
}
