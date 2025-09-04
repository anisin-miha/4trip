"use client";
import { useEffect } from "react";
// import BusHome from "@/app/(bus)/components/BusHome";

export const dynamic = "error"; // оставляем статикой

const SITE = (process.env.NEXT_PUBLIC_SITE || process.env.SITE || "trip").toLowerCase();

export default function Index() {
  // В режиме 4-bus корень "/" – это главная автобусов, без /ru
  if (SITE === "bus") {
    // return <BusHome />; 
  }

  // 4-trip: редиректим на локализованный "/ru"
  useEffect(() => {
    const s = window.location.search || "";
    const h = window.location.hash || "";
    window.location.replace(`/ru${s}${h}`);
  }, []);

  return (
    <>
      <head>
        Каноникал на целевой URL
        <link rel="canonical" href="/ru/" />
        {/* Чтобы корень не попал в индекс */}
        <meta name="robots" content="noindex,follow" />
        {/* JS-оффлайн фолбэк */}
        <meta httpEquiv="refresh" content="0; url=/ru" />
      </head>

      <a href="/ru">Перейти на /ru</a>
    </>
  );
}
