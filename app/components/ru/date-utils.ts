const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
] as const;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function normalize(date: Date): Date {
  const normalized = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function pickNearestExcursionDate({
  today = new Date(),
  availableDates,
  fallbackDates,
  timeSlots,
}: {
  today?: Date;
  availableDates: Date[];
  fallbackDates?: (string | Date)[];
  timeSlots?: string[];
}): { date: Date; slot?: string } | null {
  const now = new Date(today.getTime());
  const base = normalize(today);
  const candidates: { day: Date; original: Date }[] = [
    ...availableDates.map((d) => {
      const normalized = normalize(d);
      return { day: normalized, original: normalized };
    }),
    ...(fallbackDates ?? [])
      .map((value) => {
        if (value instanceof Date) {
          const normalized = normalize(value);
          return { day: normalized, original: new Date(value) };
        }
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return null;
        const normalized = normalize(parsed);
        return { day: normalized, original: parsed };
      })
      .filter((entry): entry is { day: Date; original: Date } => Boolean(entry)),
  ];

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => a.day.getTime() - b.day.getTime());

  const parsedSlots = (timeSlots ?? [])
    .map((slot) => {
      const match = slot.trim().match(/^(\d{1,2})[:.](\d{2})/);
      if (!match) return null;
      const hours = Number(match[1]);
      const minutes = Number(match[2]);
      if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        return null;
      }
      return { slot, hours, minutes };
    })
    .filter(
      (value): value is { slot: string; hours: number; minutes: number } =>
        Boolean(value),
    )
    .sort((a, b) => a.hours - b.hours || a.minutes - b.minutes);

  const tryCombine = (
    day: Date,
    slotMeta: { slot: string; hours: number; minutes: number },
  ) => {
    const combined = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      slotMeta.hours,
      slotMeta.minutes,
      0,
      0,
    );
    return combined;
  };

  let fallback: { date: Date; slot?: string } | null = null;

  for (const candidate of candidates) {
    if (!fallback) {
      if (parsedSlots.length > 0) {
        const firstSlot = parsedSlots[0];
        fallback = {
          date: tryCombine(candidate.day, firstSlot),
          slot: firstSlot.slot,
        };
      } else {
        fallback = { date: candidate.original, slot: undefined };
      }
    }

    if (parsedSlots.length > 0) {
      for (const slotMeta of parsedSlots) {
        const combined = tryCombine(candidate.day, slotMeta);
        if (combined.getTime() >= now.getTime()) {
          return { date: combined, slot: slotMeta.slot };
        }
      }
    } else {
      if (candidate.day.getTime() >= base.getTime()) {
        return { date: candidate.original, slot: undefined };
      }
    }

    if (candidate.original.getTime() >= now.getTime()) {
      return { date: candidate.original, slot: undefined };
    }
  }

  return fallback ?? null;
}

export function formatExcursionDateFriendly(
  date: Date | null | undefined,
  time?: string,
): string | null {
  if (!date) return null;

  const today = normalize(new Date());
  const target = normalize(date);

  const diffDays = Math.round((target.getTime() - today.getTime()) / DAY_IN_MS);

  const inferredTime =
    time ||
    (() => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      if (hours === 0 && minutes === 0) return "";
      const hh = String(hours).padStart(2, "0");
      const mm = String(minutes).padStart(2, "0");
      return `${hh}:${mm}`;
    })();

  const timeSuffix = inferredTime ? ` в ${inferredTime}` : "";

  if (diffDays === 0) {
    return `сегодня${timeSuffix ? `${timeSuffix}` : ""}`;
  }

  if (diffDays === 1) {
    return `завтра${timeSuffix ? `${timeSuffix}` : ""}`;
  }

  const day = target.getDate();
  const month = MONTHS_GENITIVE[target.getMonth()];

  return `${day} ${month}${timeSuffix}`;
}
