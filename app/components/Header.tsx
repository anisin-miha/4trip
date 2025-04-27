"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/public/images/4trip-logo.svg";

type NavLink = {
  href: string;
  label: string;
};

export default function Header({
  title,
  main = false,
  links,
}: {
  title: string;
  main?: boolean;
  links?: NavLink[];
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const defaultLinks: NavLink[] = [
    { href: "#hero", label: "Главная" },
    { href: "#attractions", label: "Описание" },
    { href: "#meeting", label: "Место встречи" },
    { href: "#booking", label: "Бронирование" },
    { href: "#gallery", label: "Галерея" },
    { href: "#faq", label: "FAQ" },
  ];

  const navLinks = links || defaultLinks;

  const forceDark = main;
  const showWhiteBg = isScrolled || forceDark;
  const showShadow = isScrolled;

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    showWhiteBg ? "bg-white" : "bg-transparent"
  } ${showShadow ? "shadow-md" : ""}`;

  const linkClasses = `block py-2 lg:py-0 hover:text-blue-600 ${
    forceDark || isScrolled ? "text-gray-800" : "text-white"
  }`;

  const titleColor = forceDark || isScrolled ? "text-gray-800" : "text-white";
  const iconColor = forceDark || isScrolled ? "text-gray-800" : "text-white";

  return (
    <>
      {menuOpen && (
        <button
          aria-label="Закрыть меню"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <header className={headerClasses}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className={"flex items-center " + iconColor}
            onClick={() => setMenuOpen(false)}
          >
            <Logo width={50} height={50} />
            <span className={`ml-2 font-bold text-xl ${titleColor}`}>
              {title}
            </span>
          </Link>

          {/* Навигация и бургер */}
          <>
            {/* Десктоп */}
            <nav className="hidden lg:block">
              <ul className="flex space-x-6">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className={linkClasses}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Мобильный бургер */}
            <button
              className={`lg:hidden focus:outline-none ${iconColor}`}
              aria-label="Открыть меню"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </>
        </div>
      </header>

      {/* Мобильное меню */}
      <nav
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col mt-24 space-y-6 px-8">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-gray-800 text-lg font-medium hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
