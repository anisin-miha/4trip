import Link from "next/link";

import BaseImage from "@/components/BaseImage";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth">
      <Header title="" main />

      <main className="py-16">
        <section className="container mx-auto px-4 mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Ваш путь к увлекательным поездкам
          </h1>
          <p className="text-xl text-gray-600">
            Организуем групповые туры по Подмосковью и не только
          </p>
        </section>

        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Наши экскурсии
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/patriot" className="block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="relative h-64">
                <BaseImage
                  src="/images/patriot/pencil.png"
                  alt="Парк Патриот"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Парк Патриот</h3>
                <p className="text-gray-600">
                  Экскурсия к Главному храму Вооруженных Сил России и музею "Дорога памяти"
                </p>
              </div>
            </Link>

            <Link href="/sergiev-posad" className="block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="relative h-64">
                <BaseImage
                  src="/images/sergiev_posad/pencil.png"
                  alt="Сергиев Посад"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Сергиев Посад</h3>
                <p className="text-gray-600">
                  Поездка в духовную столицу России с посещением Троице-Сергиевой лавры
                </p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
