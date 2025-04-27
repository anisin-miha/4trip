import { Metadata } from "next";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Блог об экскурсиях — 4-trip.ru",
  description:
    "Читайте статьи о лучших экскурсиях по Подмосковью и полезные советы для путешественников на блоге 4-trip.ru.",
  openGraph: {
    title: "Блог об экскурсиях — 4-trip.ru",
    description:
      "Интересные статьи о парках, городах и маршрутах для путешествий по Подмосковью и не только. Советы, идеи и подборки от 4-trip.ru.",
    url: "https://4-trip.ru/blog",
    type: "website",
    images: [
      {
        url: "https://4-trip.ru/images/cover.png",
        width: 1200,
        height: 630,
        alt: "4-trip.ru",
      },
    ],
  },
  alternates: {
    canonical: "https://4-trip.ru/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <Header
        title="Блог"
        main
        links={[
          { href: "/", label: "Главная" },
          { href: "/blog", label: "Блог" },
          { href: "/contacts", label: "Контакты" },
        ]}
      />

      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        <h1 className="text-4xl font-bold text-center mb-12">
          Блог об экскурсиях и путешествиях
        </h1>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="border p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-2xl font-semibold mb-3">
              5 причин съездить в Парк Патриот
            </h2>
            <p className="text-gray-600 mb-4">
              Рассказываем, почему это место стоит посетить хотя бы раз: от
              главного храма до интерактивной военной техники.
            </p>
            <Link href="#" className="text-blue-600 hover:underline">
              Читать далее →
            </Link>
          </div>

          <div className="border p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-2xl font-semibold mb-3">
              Что взять с собой на экскурсию?
            </h2>
            <p className="text-gray-600 mb-4">
              Подробный чек-лист для комфортной поездки в любое время года: от
              удобной обуви до термоса с чаем.
            </p>
            <Link href="#" className="text-blue-600 hover:underline">
              Читать далее →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
