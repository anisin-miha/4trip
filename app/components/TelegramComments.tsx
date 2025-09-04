// ── внутри этого же файла, НО выше default export ─────────────────────────────
"use client";
import { useEffect, useRef } from "react";

export function TelegramComments({
  discussion,
  limit = 10,
  dark = false,
  accent = "Default",
}: {
  discussion: string; // например "your_channel/123" или просто "your_channel"
  limit?: number;
  dark?: boolean;
  accent?: "Default" | "Cyan" | "Green" | "Yellow" | "Red" | "Black";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    // Страховка от двойного монтирования в StrictMode/dev и повторной инициализации
    if (container.dataset.tgLoaded === "1") return;
    container.innerHTML = "";

    const s = document.createElement("script");
    s.async = true;
    s.src = "https://telegram.org/js/telegram-widget.js?22";
    s.setAttribute("data-telegram-discussion", discussion);
    s.setAttribute("data-comments-limit", String(limit));
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
  }, [discussion, limit, dark, accent]);

  return <div ref={ref} className="w-full my-12" />;
}
