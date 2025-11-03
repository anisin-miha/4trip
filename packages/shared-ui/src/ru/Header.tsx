"use client";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { SHOW_BUS_LINKS } from "./config";

export type NavLink = { href: string; label: string };

export default function Header({
  title,
  main = false,
  links,
  project,
  logoSrc = "/images/4trip-logo.svg",
  logoAlt = "4‑trip logo",
  Logo,
  LinkComponent,
}: {
  title: string;
  main?: boolean;
  links?: NavLink[];
  project?: "bus" | "trip";
  logoSrc?: string;
  logoAlt?: string;
  Logo?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children?: React.ReactNode;
    onClick?: (e: any) => void;
  }>;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isExcursionPage, setIsExcursionPage] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsExcursionPage(/\/ru\/excursions\//.test(window.location.pathname));
    }
  }, []);

  const navLinks: NavLink[] = links || [
    { href: "/", label: "Главная" },
    { href: "#", label: "Разделы" },
  ];

  const isProd = process.env.NODE_ENV === "production";
  const tripUrl = isProd ? "https://4-trip.ru/ru" : "http://localhost:3000/ru";
  const busUrl = isProd ? "https://4-bus.ru/" : "http://localhost:3001/";
  const logoBase = isProd ? "https://4-trip.ru" : "http://localhost:3000";

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
  const LinkTag: any = LinkComponent || NextLink;
  const homeHref = LinkComponent ? "/" : project === "trip" ? "/ru" : "/";

  return (
    <>
      {menuOpen && (
        <button
          aria-label="Закрыть меню"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <header
        className={headerClasses}
        style={{
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.4)" : "unset",
          backdropFilter: isScrolled ? "blur(10px)" : "none",
        }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <LinkTag
            href={homeHref}
            className={"flex items-center gap-2 " + iconColor}
          >
            {Logo ? (
              <Logo
                width={isScrolled ? 30 : 50}
                height={isScrolled ? 30 : 50}
                style={{ transition: ".23s ease" }}
              />
            ) : (
              <img
                src={
                  logoSrc.startsWith("/") ? `${logoBase}${logoSrc}` : logoSrc
                }
                alt={logoAlt}
                width={isScrolled ? 30 : 50}
                height={isScrolled ? 30 : 50}
                style={{ transition: ".23s ease" }}
              />
            )}
            {!isExcursionPage && (
              <span className={`font-bold text-xl ${titleColor}`}>{title}</span>
            )}
          </LinkTag>

          <>
            <nav className="hidden lg:block">
              <ul className="flex space-x-6 items-center">
                {navLinks.map(({ href, label }) => {
                  const isTripBusLink =
                    project === "trip" &&
                    (/(^|\/)bus(\/|$)/.test(href) || /автобус/i.test(label));
                  if (isTripBusLink && !SHOW_BUS_LINKS) return null;
                  return (
                    <li key={`${href}-${label}`}>
                      {isTripBusLink && SHOW_BUS_LINKS ? (
                        <a href={busUrl} className={linkClasses}>
                          {label}
                        </a>
                      ) : (
                        <LinkTag href={href} className={linkClasses}>
                          {label}
                        </LinkTag>
                      )}
                    </li>
                  );
                })}
                {project && (
                  <li className="ml-4">
                    {project === "bus" ? (
                      <a href={tripUrl} className={linkClasses}>
                        4‑trip
                      </a>
                    ) : SHOW_BUS_LINKS ? (
                      <a href={busUrl} className={linkClasses}>
                        4‑bus
                      </a>
                    ) : null}
                  </li>
                )}
              </ul>
            </nav>

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

      <nav
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col mt-24 space-y-6 px-8">
          {navLinks.map(({ href, label }) => {
            const isTripBusLink =
              project === "trip" &&
              (/(^|\/)bus(\/|$)/.test(href) || /автобус/i.test(label));
            if (isTripBusLink && !SHOW_BUS_LINKS) return null;
            return (
              <li key={`${href}-${label}`}>
                {isTripBusLink && SHOW_BUS_LINKS ? (
                  <a
                    href={busUrl}
                    className="text-gray-800 text-lg font-medium hover:text-blue-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                ) : (
                  <LinkTag
                    href={href}
                    className="text-gray-800 text-lg font-medium hover:text-blue-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </LinkTag>
                )}
              </li>
            );
          })}
          {project && (
            <li>
              {project === "bus" ? (
                <a
                  href={tripUrl}
                  className="text-gray-800 text-lg font-medium hover:text-blue-600"
                >
                  4‑trip
                </a>
              ) : SHOW_BUS_LINKS ? (
                <a
                  href={busUrl}
                  className="text-gray-800 text-lg font-medium hover:text-blue-600"
                >
                  4‑bus
                </a>
              ) : null}
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
