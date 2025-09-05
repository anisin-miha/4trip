// ── внутри этого же файла, НО выше default export ─────────────────────────────
"use client";
import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

export function TelegramComments({
  discussion,
  limit = 10,
  dark = false,
  accent = "Default",
  lang = "ru",
}: {
  discussion: string; // например "your_channel/123" или просто "your_channel"
  limit?: number;
  dark?: boolean;
  accent?: "Default" | "Cyan" | "Green" | "Yellow" | "Red" | "Black";
  lang?: "ru" | "en" | string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale?.() as string | undefined;
  const resolvedLang = (lang || locale || "ru").split("-")[0].toLowerCase();
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    // Страховка от двойного монтирования в StrictMode/dev и повторной инициализации
    if (container.dataset.tgLoaded === "1") return;
    container.innerHTML = "";

    const s = document.createElement("script");
    s.async = true;
    // Принудительно укажем язык интерфейса виджета
    s.src = `https://telegram.org/js/telegram-widget.js?22&lang=${encodeURIComponent(resolvedLang)}`;
    s.setAttribute("data-telegram-discussion", discussion);
    s.setAttribute("data-comments-limit", String(limit));
    // На некоторых версиях виджета работает и data-lang
    s.setAttribute("data-lang", resolvedLang);
    // Опциональные настройки:
    // s.setAttribute("data-dark", dark ? "1" : "0");
    // s.setAttribute("data-color", accent);
    container.appendChild(s);
    container.dataset.tgLoaded = "1";
    return () => {
      if (container) {
        container.innerHTML = "";
        delete container.dataset.tgLoaded;
      }
    };
  }, [discussion, limit, dark, accent, resolvedLang]);

  return <div ref={ref} className="w-full my-12" />;
}
