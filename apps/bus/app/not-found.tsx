import { Header, Logo4Trip } from "@/packages/shared-ui/src/ru";
import Link from "next/link";

const headerLinks = [
  { href: "/", label: "Главная" },
  { href: "/avtopark", label: "Автопарк" },
  { href: "/tarify", label: "Тарифы и цены" },
  { href: "/usloviya-arendy", label: "Условия аренды" },
  { href: "/oplata", label: "Оплата" },
  { href: "/faq", label: "FAQ" },
  { href: "/otzyvy", label: "Отзывы" },
  { href: "/contacts", label: "Контакты" },
];

export default function NotFound() {
  return (
    <div className="font-sans bg-white text-gray-900 min-h-screen flex flex-col">
      <Header
        title="Страница не найдена"
        main
        Logo={Logo4Trip}
        project="bus"
        links={headerLinks}
      />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-3">404 — Ничего не найдено</h1>
        <p className="text-gray-600 mb-6">Похоже, такой страницы нет или она переехала.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="inline-block bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800 transition">На главную</Link>
          <Link href="/contacts" className="inline-block border border-gray-300 px-5 py-3 rounded-md hover:bg-gray-100 transition">Контакты</Link>
        </div>
      </div>
    </div>
  );
}
