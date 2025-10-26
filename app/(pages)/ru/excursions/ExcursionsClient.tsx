"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Link as IntlLink } from "@/i18n/navigation";
import TourCard from "@/app/components/ru/TourCard";
import type { Tour } from "@/app/config/ru/tours";

type TourListItem = Tour & { href: string };

function parseFirstTimeToMinutes(startTime?: string): number | undefined {
  if (!startTime) return undefined;
  const m = startTime.match(/(\d{1,2}):(\d{2})/);
  if (!m) return undefined;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  return h * 60 + min;
}

function parseDurationHoursRange(
  duration?: string,
): [number, number] | undefined {
  if (!duration) return undefined;
  const dayMatch = duration.match(/(\d+)\s*дн/i);
  if (dayMatch) {
    const d = parseInt(dayMatch[1], 10);
    return [d * 24, d * 24];
  }
  const hrs = duration.match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*ч/i);
  if (hrs) {
    const a = parseInt(hrs[1], 10);
    const b = hrs[2] ? parseInt(hrs[2], 10) : a;
    return [a, b];
  }
  return undefined;
}

function getImage(t: TourListItem): string {
  return t.hero?.image || "";
}

function languagesOf(t: TourListItem): string[] {
  const set = new Set<string>();
  if (t.languages) t.languages.forEach((l) => set.add(l));
  if (t.meetingPoint?.language) set.add(t.meetingPoint.language);
  return Array.from(set);
}

function typeOfTour(
  t: TourListItem,
): "Групповой" | "Индивидуальный" | "Сборная" | undefined {
  const type = t.meetingPoint?.type || "";
  if (/индивид/i.test(type)) return "Индивидуальный";
  if (/сборн/i.test(type)) return "Сборная";
  if (/групп/i.test(type)) return "Групповой";
  return undefined;
}

const TAG_DICTIONARY: Record<string, string[]> = {
  Обзор: ["обзорн", "панорам"],
  "Храмы/Святыни": ["лавр", "храм", "собор", "свят", "патриарх"],
  "Кремли/История": ["кремл", "летопис", "истор", "засеч", "музей истории"],
  Музеи: ["музей", "экспозици", "выставк"],
  Природа: ["парк", "природ", "гора", "набережн", "сад"],
  Гастро: ["пастил", "калач", "дегустаци", "кухн", "полевая кухня"],
};

function extractText(t: TourListItem): string {
  return [t.title, t.location, (t as any).description, t.hero?.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function tagsOf(t: TourListItem): string[] {
  const text = extractText(t);
  const tags: string[] = [];
  for (const [tag, keys] of Object.entries(TAG_DICTIONARY)) {
    if (keys.some((k) => text.includes(k))) tags.push(tag);
  }
  return tags;
}

function startBucket(
  minutes?: number,
): "morning" | "day" | "evening" | undefined {
  if (minutes == null) return undefined;
  if (minutes <= 11 * 60) return "morning";
  if (minutes <= 17 * 60) return "day";
  return "evening";
}

function durationBucket(
  hoursRange?: [number, number],
): "short" | "mid" | "day1" | "multi" | undefined {
  if (!hoursRange) return undefined;
  const [a, b] = hoursRange;
  const max = Math.max(a, b);
  if (max <= 3) return "short";
  if (max <= 5) return "mid";
  if (max <= 12) return "day1";
  return "multi";
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export default function ExcursionsClient({
  allTours,
}: {
  allTours: TourListItem[];
}) {
  const search = useSearchParams();

  const q = (search.get("q") || "").trim().toLowerCase();
  const city = search.get("city") || "";
  const priceMin = search.get("price_gte")
    ? Number(search.get("price_gte"))
    : undefined;
  const priceMax = search.get("price_lte")
    ? Number(search.get("price_lte"))
    : undefined;
  const ratingGte = search.get("rating_gte")
    ? Number(search.get("rating_gte"))
    : undefined;
  const start = search.get("start") as
    | "morning"
    | "day"
    | "evening"
    | null
    | undefined;
  const dur = search.get("duration") as
    | "short"
    | "mid"
    | "day1"
    | "multi"
    | null
    | undefined;
  const langsA = (search.getAll("lang") || []) as string[];
  const langsB = search.get("lang");
  const lang: string[] = uniq([
    ...(langsA || []),
    ...(langsB ? [langsB] : []),
  ]).filter(Boolean) as string[];
  const typesA = (search.getAll("type") || []) as string[];
  const typesB = search.get("type");
  const type: string[] = uniq([
    ...(typesA || []),
    ...(typesB ? [typesB] : []),
  ]).filter(Boolean) as string[];
  const tagsFromParams = search.getAll("tags");
  const tagsSingle = search.get("tags");
  const tags: string[] = uniq([
    ...(tagsFromParams || []),
    ...((tagsSingle && tagsSingle.split(",")) || []),
  ]).filter(Boolean) as string[];

  const allCities = useMemo(
    () => uniq(allTours.map((t) => t.city).filter(Boolean) as string[]).sort(),
    [allTours],
  );
  const allTags = useMemo(
    () => uniq(allTours.flatMap(tagsOf)).sort(),
    [allTours],
  );

  const results = useMemo(() => {
    return allTours.filter((t) => {
      if (q) {
        const text = extractText(t);
        if (!text.includes(q)) return false;
      }
      if (city && t.city !== city) return false;
      if (typeof priceMin === "number" && (t.price ?? Infinity) < priceMin)
        return false;
      if (typeof priceMax === "number" && (t.price ?? -Infinity) > priceMax)
        return false;
      if (typeof ratingGte === "number" && ((t as any).rating ?? 0) < ratingGte)
        return false;
      if (lang.length) {
        const ls = languagesOf(t);
        if (!lang.some((l) => ls.includes(l))) return false;
      }
      if (type.length) {
        const tt = typeOfTour(t);
        if (!tt || !type.includes(tt)) return false;
      }
      if (start) {
        const firstSlot = t.meetingPoint?.timeSlots?.[0];
        const bucket = startBucket(parseFirstTimeToMinutes(firstSlot));
        if (bucket !== start) return false;
      }
      if (dur) {
        const b = durationBucket(
          parseDurationHoursRange(t.duration ?? t.meetingPoint?.duration),
        );
        if (b !== dur) return false;
      }
      if (tags.length) {
        const ts = tagsOf(t);
        if (!tags.every((tag) => ts.includes(tag))) return false; // require all
      }
      return true;
    });
  }, [
    allTours,
    q,
    city,
    priceMin,
    priceMax,
    ratingGte,
    lang,
    type,
    start,
    dur,
    tags,
  ]);

  const activeCount =
    (q ? 1 : 0) +
    (city ? 1 : 0) +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0) +
    (ratingGte ? 1 : 0) +
    (start ? 1 : 0) +
    (dur ? 1 : 0) +
    (lang.length ? 1 : 0) +
    (type.length ? 1 : 0) +
    (tags.length ? 1 : 0);

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Sidebar */}
      <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
        <div className="lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Фильтры</h2>
            <IntlLink
              href="/excursions"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
              aria-label="Сбросить все фильтры"
            >
              Сбросить
            </IntlLink>
          </div>
          <form id="filters" method="get" className="space-y-5">
            {/* Поиск */}
            <div>
              <label className="block text-sm font-medium mb-1">Поиск</label>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Название, место, описание…"
                className="w-full rounded-xl border border-gray-300 px-3 py-2"
                data-autosubmit="debounce"
              />
            </div>

            {/* Цена */}
            <div>
              <span className="block text-sm font-medium mb-1">Цена, ₽</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="price_gte"
                  defaultValue={priceMin ?? ""}
                  min={0}
                  step={100}
                  placeholder="от"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2"
                  data-autosubmit="change"
                />
                <input
                  type="number"
                  name="price_lte"
                  defaultValue={priceMax ?? ""}
                  min={0}
                  step={100}
                  placeholder="до"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2"
                  data-autosubmit="change"
                />
              </div>
            </div>

            {/* Город */}
            <div>
              <label className="block text-sm font-medium mb-1">Город</label>
              <select
                name="city"
                defaultValue={city}
                className="w-full rounded-xl border border-gray-300 px-3 py-2"
                data-autosubmit="change"
              >
                <option value="">Все</option>
                {allCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Рейтинг + Длительность */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Рейтинг от
                </label>
                <select
                  name="rating_gte"
                  defaultValue={ratingGte ?? ""}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2"
                  data-autosubmit="change"
                >
                  <option value="">—</option>
                  <option value="4">4.0</option>
                  <option value="4.5">4.5</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Длительность
                </label>
                <select
                  name="duration"
                  defaultValue={dur ?? ""}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2"
                  data-autosubmit="change"
                >
                  <option value="">—</option>
                  <option value="short">Короткая (до 3 ч)</option>
                  <option value="mid">Средняя (до 5 ч)</option>
                  <option value="day1">День (до 12 ч)</option>
                  <option value="multi">Дольше</option>
                </select>
              </div>
            </div>

            {/* Время старта */}
            <div>
              <span className="block text-sm font-medium mb-1">
                Время старта
              </span>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "morning", label: "Утро (до 11:00)" },
                    { value: "day", label: "День (11:00–17:00)" },
                    { value: "evening", label: "Вечер (после 17:00)" },
                  ] as const
                ).map((o) => {
                  const checked = start === o.value;
                  return (
                    <label
                      key={o.value}
                      className={
                        "px-3 py-1 rounded-full border text-sm cursor-pointer " +
                        (checked
                          ? "border-blue-600 text-blue-700 bg-blue-50"
                          : "border-gray-300 text-gray-700")
                      }
                    >
                      <input
                        type="radio"
                        name="start"
                        value={o.value}
                        defaultChecked={checked}
                        className="sr-only"
                        data-autosubmit="change"
                      />
                      {o.label}
                    </label>
                  );
                })}
                <label className="px-3 py-1 rounded-full border text-sm cursor-pointer border-gray-300 text-gray-700">
                  <input
                    type="radio"
                    name="start"
                    value=""
                    defaultChecked={!start}
                    className="sr-only"
                    data-autosubmit="change"
                  />
                  Любое
                </label>
              </div>
            </div>

            {/* Язык + Тип */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="block text-sm font-medium mb-1">Язык</span>
                <div className="flex flex-wrap gap-2">
                  {uniq(allTours.flatMap(languagesOf)).map((l) => {
                    const checked = lang.includes(l);
                    return (
                      <label
                        key={l}
                        className={
                          "px-3 py-1 rounded-full border text-sm cursor-pointer " +
                          (checked
                            ? "border-indigo-600 text-indigo-700 bg-indigo-50"
                            : "border-gray-300 text-gray-700")
                        }
                      >
                        <input
                          type="checkbox"
                          name="lang"
                          value={l}
                          defaultChecked={checked}
                          className="sr-only"
                          data-autosubmit="change"
                        />
                        {l}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <span className="block text-sm font-medium mb-1">Тип</span>
                <div className="flex flex-wrap gap-2">
                  {["Групповой", "Сборная", "Индивидуальный"].map((t) => {
                    const checked = type.includes(t);
                    return (
                      <label
                        key={t}
                        className={
                          "px-3 py-1 rounded-full border text-sm cursor-pointer " +
                          (checked
                            ? "border-amber-600 text-amber-700 bg-amber-50"
                            : "border-gray-300 text-gray-700")
                        }
                      >
                        <input
                          type="checkbox"
                          name="type"
                          value={t}
                          defaultChecked={checked}
                          className="sr-only"
                          data-autosubmit="change"
                        />
                        {t}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Тематики */}
            <div>
              <span className="block text-sm font-medium mb-1">Тематики</span>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const checked = tags.includes(tag);
                  return (
                    <label
                      key={tag}
                      className={
                        "px-3 py-1 rounded-full border text-sm cursor-pointer " +
                        (checked
                          ? "border-emerald-600 text-emerald-700 bg-emerald-50"
                          : "border-gray-300 text-gray-700")
                      }
                    >
                      <input
                        type="checkbox"
                        name="tags"
                        value={tag}
                        defaultChecked={checked}
                        className="sr-only"
                        data-autosubmit="change"
                      />
                      {tag}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Helper: кол-во активных */}
            <div className="text-xs text-gray-500 pt-1">
              Активных фильтров: {activeCount}
            </div>

            {/* Автосабмит — без client-компонентов */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(){
                    const form = document.getElementById('filters');
                    if(!form) return;

                    let t;
                    const debounce = (fn, ms) => (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null,args), ms); };

                    const requestSubmit = () => {
                      if (form.requestSubmit) form.requestSubmit();
                      else form.submit();
                    };

                    // Изменения (select/checkbox/number)
                    form.addEventListener('change', function(e){
                      const target = e.target;
                      if (target && target.getAttribute('data-autosubmit') === 'change') {
                        requestSubmit();
                      }
                    });

                    // Поиск — дебаунс
                    const q = form.querySelector('input[name="q"]');
                    if(q){
                      const submitDebounced = debounce(requestSubmit, 350);
                      q.addEventListener('input', function(){
                        submitDebounced();
                      });
                    }
                  })();
                `,
              }}
            />
            <noscript>
              <p className="text-xs text-gray-500">
                Включите JavaScript для автоприменения фильтров.
              </p>
            </noscript>
          </form>
        </div>
      </aside>

      {/* Results */}
      <div className="col-span-12 lg:col-span-8 xl:col-span-9">
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => {
            const href = t.href || `/excursions/${t.slug}`;
            return (
              <TourCard
                key={t.title}
                href={href}
                title={t.title}
                imageSrc={getImage(t)}
                imageAlt={`Фото для ${t.title}`}
                price={t.price}
                duration={t.duration ?? t.meetingPoint?.duration}
                languages={languagesOf(t)}
                city={t.city}
                meetingPoint={t.meetingPoint?.address}
                badges={t.hero?.badges}
                rating={t.rating}
                description={(t as any).description ?? ""}
              />
            );
          })}
        </div>

        {/* Пустая выборка */}
        {!results.length && (
          <div className="mt-10 rounded-xl border border-gray-200 p-6 text-gray-700">
            Ничего не найдено. Попробуйте ослабить фильтры или{" "}
            <IntlLink href="/excursions" className="underline">
              сбросить все
            </IntlLink>
            .
          </div>
        )}
      </div>
    </div>
  );
}
