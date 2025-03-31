"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import BaseImage from "@/components/BaseImage";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <BaseImage
            src="/images/logo.png"
            alt="Парк Патриот Лого"
            width={50}
            height={50}
          />
          <span
            className={`ml-2 font-bold text-xl ${isScrolled ? "text-gray-800" : "text-white"}`}
          >
            Парк Патриот Тур
          </span>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="#hero"
                className={`hover:text-blue-600 ${isScrolled ? "text-gray-800" : "text-white"}`}
              >
                Главная
              </Link>
            </li>
            <li>
              <Link
                href="#usp"
                className={`hover:text-blue-600 ${isScrolled ? "text-gray-800" : "text-white"}`}
              >
                Преимущества
              </Link>
            </li>
            <li>
              <Link
                href="#attractions"
                className={`hover:text-blue-600 ${isScrolled ? "text-gray-800" : "text-white"}`}
              >
                Описание
              </Link>
            </li>
            <li>
              <Link
                href="#info"
                className={`hover:text-blue-600 ${isScrolled ? "text-gray-800" : "text-white"}`}
              >
                Информация
              </Link>
            </li>
            <li>
              <Link
                href="#booking"
                className={`hover:text-blue-600 ${isScrolled ? "text-gray-800" : "text-white"}`}
              >
                Бронирование
              </Link>
            </li>
            <li>
              <Link
                href="#gallery"
                className={`hover:text-blue-600 ${isScrolled ? "text-gray-800" : "text-white"}`}
              >
                Галерея
              </Link>
            </li>
            <li>
              <Link
                href="#faq"
                className={`hover:text-blue-600 ${isScrolled ? "text-gray-800" : "text-white"}`}
              >
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
        <button className="md:hidden text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
