// ── внутри этого же файла, НО выше default export ─────────────────────────────
"use client";
import { useEffect, useRef, useState } from "react";
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
  const [showFallback, setShowFallback] = useState(false);
  const locale = useLocale?.() as string | undefined;
  const resolvedLang = (lang || locale || "ru").split("-")[0].toLowerCase();
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    // Пересоздаём виджет на каждое изменение параметров
    container.innerHTML = "";
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://telegram.org/js/telegram-widget.js?22`;
    s.setAttribute("data-telegram-discussion", discussion);
    s.setAttribute("data-comments-limit", String(limit));
    // Передадим параметры оформления, если нужны
    s.setAttribute("data-lang", resolvedLang);
    if (dark) s.setAttribute("data-dark", "1");
    if (accent && accent !== "Default") s.setAttribute("data-color", accent);
    container.appendChild(s);
    // простая проверка и фолбэк, если виджет не отрендерился (adblock/CSP)
    const t = window.setTimeout(() => {
      const hasIframe = !!container.querySelector("iframe");
      if (!hasIframe) setShowFallback(true);
    }, 2500);
    return () => {
      if (container) {
        container.innerHTML = "";
      }
      window.clearTimeout(t);
    };
  }, [discussion, limit, dark, accent, resolvedLang]);

  return (
    <div className="w-full my-12">
      <div ref={ref} />
      {showFallback && (
        <div className="mt-4 text-sm text-gray-600">
          Не получается загрузить виджет комментариев. Откройте обсуждение в Telegram: {" "}
          <a
            href={`https://t.me/${discussion}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            t.me/{discussion}
          </a>
        </div>
      )}
    </div>
  );
}
