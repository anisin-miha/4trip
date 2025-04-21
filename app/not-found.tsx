import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <Header title="" main />

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-xl">
          <h1 className="text-5xl font-bold mb-6">404 — Страница не найдена</h1>
          <p className="text-lg text-gray-600 mb-8">
            Кажется, вы свернули не туда. Такой страницы не существует или она была перемещена.
          </p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
          >
            На главную
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
