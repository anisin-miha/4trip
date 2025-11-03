"use client";

import { useEffect, useState } from "react";

type Props = {
  targetGridId: string;
  locations: string[];
  categories: string[];
  minPrice: number;
  maxPrice: number;
};

export default function FiltersClient({
  targetGridId,
  locations,
  categories,
  minPrice,
  maxPrice,
}: Props) {
  const [loc, setLoc] = useState("Все");
  const [cat, setCat] = useState("Все");
  const [price, setPrice] = useState<[number, number]>([minPrice, maxPrice]);

  const grid =
    typeof document === "undefined"
      ? null
      : document.getElementById(targetGridId);

  useEffect(() => {
    if (!grid) return;
    const items = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-price]"),
    );
    items.forEach((el) => {
      const p = Number(el.dataset.price || "0");
      const locs = (el.dataset.locs || "").split("||").filter(Boolean);
      const cats = (el.dataset.tags || "").split("||").filter(Boolean);

      const byLoc = loc === "Все" || locs.includes(loc);
      const byCat = cat === "Все" || cats.includes(cat);
      const byPrice = p >= price[0] && p <= price[1];

      el.classList.toggle("hidden", !(byLoc && byCat && byPrice));
    });
  }, [grid, loc, cat, price]);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 p-4 md:p-5">
      {/* Локации */}
      <div className="flex flex-wrap gap-2">
        {["Все", ...locations].map((l) => (
          <button
            key={l}
            onClick={() => setLoc(l)}
            className={`px-3 py-1 rounded-full border text-sm ${
              loc === l
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white hover:bg-gray-50 border-gray-300 text-gray-800"
            }`}
            aria-pressed={loc === l}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Категории */}
      <div className="mt-3 flex flex-wrap gap-2">
        {["Все", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1 rounded-full border text-sm ${
              cat === c
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white hover:bg-gray-50 border-gray-300 text-gray-800"
            }`}
            aria-pressed={cat === c}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Цена */}
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto] items-center">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Диапазон цены
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={minPrice}
              max={price[1]}
              step={100}
              value={price[0]}
              onChange={(e) =>
                setPrice([Math.min(+e.target.value, price[1] - 100), price[1]])
              }
              className="w-full"
              aria-label="Минимальная цена"
            />
            <input
              type="range"
              min={price[0]}
              max={maxPrice}
              step={100}
              value={price[1]}
              onChange={(e) =>
                setPrice([price[0], Math.max(+e.target.value, price[0] + 100)])
              }
              className="w-full"
              aria-label="Максимальная цена"
            />
          </div>
        </div>
        <div className="text-right text-sm text-gray-700">
          {price[0].toLocaleString("ru-RU")} ₽ —{" "}
          {price[1].toLocaleString("ru-RU")} ₽
        </div>
        <div className="text-right">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
            onClick={() => {
              setLoc("Все");
              setCat("Все");
              setPrice([minPrice, maxPrice]);
            }}
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
    </div>
  );
}
