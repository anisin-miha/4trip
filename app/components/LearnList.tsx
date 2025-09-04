"use client";

import { useEffect, useMemo, useRef } from "react";
import { useInView } from "@/hooks/use-in-view";

type LearnListProps = {
  title?: string;
  items: string[];
};

export default function LearnList({ title = "Вы узнаете:", items }: LearnListProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  useScrollDrive(cardRefs, true);

  const enriched = useMemo(
    () => items.map((text, idx) => ({ text, delay: 220 * idx })),
    [items],
  );

  return (
    <div ref={ref} className="rounded-2xl">
      <h3 className="text-3xl md:text-4xl font-semibold mb-10 text-center">{title}</h3>

      <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
        {enriched.map(({ text, delay }, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className={[
              "relative overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-b from-white to-gray-50 p-5 md:p-6 lg:p-7",
              "shadow-sm hover:shadow-md transition-shadow will-change-transform",
              "opacity-0",
            ].join(" ")}
          >
            <p className="text-gray-900 leading-snug text-lg md:text-xl">
              {text.replace(/[.;]+\s*$/u, "")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Scroll-coupled animation: cards translate from left/right and fade in based on viewport position
// Uses rAF-throttled scroll/resize listeners for smoothness
export function useScrollDrive(cardsRef: React.MutableRefObject<(HTMLDivElement | null)[]>, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    const update = () => {
      const vh = window.innerHeight || 0;
      const start = vh * 0.95; // when card's top is near bottom
      const end = vh * 0.35; // when card's top reached upper third

      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const top = rect.top;

        // Сначала слева, потом справа в каждой строке (2-колоночная сетка)
        const col = i % 2; // 0 = left, 1 = right
        const row = Math.floor(i / 2);
        // Базовый сдвиг по строкам, чтобы последующие строки стартовали позже
        const rowPhasePx = row * 40;
        // Дополнительная задержка для правой карточки в строке, чтобы она шла после левой
        const rightColExtraPx = col === 1 ? 140 : 0;
        // Небольшой джиттер для живости
        const jitterPx = ((i * 37) % 17) - 8;
        const phasePx = rowPhasePx + rightColExtraPx + jitterPx;
        const topPrime = top + phasePx;

        let t = (start - topPrime) / (start - end); // 0..1
        if (t < 0) t = 0;
        if (t > 1) t = 1;

        // Разные кривые ускорения для разнообразия темпа
        const eased = (i % 2 === 0 ? easeOutCubic : easeOutQuint)(t);

        const dir = col === 0 ? -1 : 1;
        const baseOffset = 64; // px
        const offset = (1 - eased) * baseOffset;
        el.style.transform = `translateX(${dir * offset}px)`;
        el.style.opacity = String(eased);
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cardsRef, enabled]);
}
