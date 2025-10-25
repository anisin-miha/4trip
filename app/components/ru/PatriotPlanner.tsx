"use client";

import { useEffect, useMemo, useState } from "react";

type Pace = "fast" | "normal" | "relaxed";

type Attraction = {
  id: string;
  name: string;
  baseMinutes: number; // базовая длительность в минутах
  defaultSelected?: boolean;
};

const ALL_ATTRACTIONS: Attraction[] = [
  {
    id: "main-temple",
    name: "Главный храм Вооружённых Сил РФ",
    baseMinutes: 90,
    defaultSelected: true,
  },
  {
    id: "memory-road",
    name: "Музейный комплекс «Дорога Памяти»",
    baseMinutes: 75,
    defaultSelected: true,
  },
  {
    id: "kubinka",
    name: "Танковый музей (Кубинка)",
    baseMinutes: 80,
    defaultSelected: true,
  },
  {
    id: "air-defense",
    name: "Авиация и ПВО",
    baseMinutes: 60,
    defaultSelected: true,
  },
  {
    id: "open-areas",
    name: "Открытые площадки / «Поле Победы»",
    baseMinutes: 45,
  },
  { id: "partisan", name: "Комплекс «Партизанская деревня»", baseMinutes: 50 },
];

const PACE_FACTOR: Record<Pace, number> = {
  fast: 0.85,
  normal: 1.0,
  relaxed: 1.2,
};

function parseTimeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function minutesToTime(total: number): string {
  const m = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}

export default function PatriotPlanner() {
  const [startTime, setStartTime] = useState<string>("11:00");
  const [pace, setPace] = useState<Pace>("normal");
  // Important: initialize deterministically to avoid hydration mismatch.
  // Load localStorage selection after mount.
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    ALL_ATTRACTIONS.forEach((a) => (init[a.id] = !!a.defaultSelected));
    return init;
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("patriotPlanner:selected");
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, boolean>;
        setSelected((prev) => {
          // merge only if actually different to avoid extra re-render
          const keys = Object.keys(prev);
          const isSame =
            keys.length === Object.keys(saved).length &&
            keys.every((k) => !!prev[k] === !!saved[k]);
          return isSame ? prev : { ...prev, ...saved };
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("patriotPlanner:selected", JSON.stringify(selected));
    } catch {}
  }, [selected]);

  const chosen = useMemo(
    () => ALL_ATTRACTIONS.filter((a) => selected[a.id]),
    [selected],
  );

  const schedule = useMemo(() => {
    const items: {
      id: string;
      name: string;
      start: number;
      end: number;
      kind: "visit" | "break";
    }[] = [];
    let cursor = parseTimeToMinutes(startTime);
    let minutesSinceBreak = 0;

    const addBreak = () => {
      items.push({
        id: `break-${items.length}`,
        name: "Перерыв (перекус/кофе)",
        start: cursor,
        end: cursor + 20,
        kind: "break",
      });
      cursor += 20;
      minutesSinceBreak = 0;
    };

    chosen.forEach((a, idx) => {
      // Перерыв примерно каждые 120 минут или перед 3-м крупным блоком
      if (minutesSinceBreak >= 120 && idx > 0) addBreak();

      const duration = Math.round(a.baseMinutes * PACE_FACTOR[pace]);
      const start = cursor;
      const end = start + duration;
      items.push({ id: a.id, name: a.name, start, end, kind: "visit" });
      cursor = end;
      minutesSinceBreak += duration;
    });

    return items;
  }, [chosen, pace, startTime]);

  const totalMinutes = useMemo(
    () => schedule.reduce((acc, s) => acc + (s.end - s.start), 0),
    [schedule],
  );

  const copyText = async () => {
    const lines = [
      `Маршрут на день — Парк «Патриот»`,
      `Старт: ${startTime}, темп: ${pace === "fast" ? "быстрый" : pace === "relaxed" ? "неспешный" : "нормальный"}`,
      "",
      ...schedule.map(
        (s) => `${minutesToTime(s.start)}–${minutesToTime(s.end)} — ${s.name}`,
      ),
      "",
      `Итого: ~${Math.round(totalMinutes / 60)} ч ${totalMinutes % 60} мин`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      alert("План скопирован в буфер обмена");
    } catch {
      // Фолбэк
      const ta = document.createElement("textarea");
      ta.value = lines.join("\n");
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("План скопирован (фолбэк)");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 lg:p-6 shadow">
      <h3 className="text-2xl font-semibold mb-3">Соберите маршрут на день</h3>
      <p className="text-gray-600 mb-4">
        Отметьте объекты, выберите время старта и темп — мы посчитаем
        длительность и предложим удобный порядок с перерывами.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <label className="block text-sm text-gray-700">Время старта</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-700">Темп</label>
          <select
            value={pace}
            onChange={(e) => setPace(e.target.value as Pace)}
            className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="fast">Быстрый</option>
            <option value="normal">Нормальный</option>
            <option value="relaxed">Неспешный</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-700">Итого по плану</label>
          <div className="w-full h-10 border border-gray-200 rounded-md px-3 py-2 bg-gray-50 flex items-center">
            ~{Math.round(totalMinutes / 60)} ч {totalMinutes % 60} мин
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Объекты</h4>
          <ul className="space-y-2">
            {ALL_ATTRACTIONS.map((a) => (
              <li key={a.id} className="flex items-center gap-2">
                <input
                  id={a.id}
                  type="checkbox"
                  checked={!!selected[a.id]}
                  onChange={(e) =>
                    setSelected((s) => ({ ...s, [a.id]: e.target.checked }))
                  }
                />
                <label htmlFor={a.id} className="cursor-pointer select-none">
                  {a.name}
                  <span className="text-gray-500 text-sm ml-1">
                    (~{a.baseMinutes} мин)
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">План на день</h4>
          {schedule.length === 0 ? (
            <p className="text-gray-600">Выберите хотя бы один объект.</p>
          ) : (
            <ol className="space-y-2">
              {schedule.map((s) => (
                <li
                  key={s.id}
                  className={`p-3 rounded border ${s.kind === "break" ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="text-sm text-gray-500">
                    {minutesToTime(s.start)}–{minutesToTime(s.end)}
                  </div>
                  <div className="font-medium">{s.name}</div>
                </li>
              ))}
            </ol>
          )}
          <div className="mt-3 flex gap-2">
            <button
              onClick={copyText}
              className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Скопировать план
            </button>
            <button
              onClick={() =>
                setSelected(() => {
                  const init: Record<string, boolean> = {};
                  ALL_ATTRACTIONS.forEach(
                    (a) => (init[a.id] = !!a.defaultSelected),
                  );
                  return init;
                })
              }
              className="inline-flex items-center justify-center px-3 py-2 rounded-md border text-sm font-semibold hover:bg-gray-50"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
