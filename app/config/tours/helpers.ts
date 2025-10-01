export type MeetingPointInfoItem = {
  label: string;
  value: string;
};

export type MeetingPointDetails = {
  mapSrc: string;
  address: string;
  startTime?: string;
  duration?: string;
  endAddress?: string;
  type?: string;
  groupSize?: string;
  forWhom?: string;
  language?: string;
  price?: string;
  note?: string;
  lat?: number;
  lng?: number;
};

const infoSources: Array<{ key: keyof MeetingPointDetails; label: string }> = [
  { key: "type", label: "Тип экскурсии" },
  { key: "startTime", label: "Время начала" },
  { key: "duration", label: "Длительность" },
  { key: "address", label: "Место встречи" },
  { key: "endAddress", label: "Место окончания" },
  { key: "groupSize", label: "Размер группы" },
  { key: "forWhom", label: "Для кого" },
  { key: "language", label: "Язык экскурсии" },
  { key: "price", label: "Стоимость" },
];

function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function createMeetingPoint(details: MeetingPointDetails) {
  const info: MeetingPointInfoItem[] = infoSources
    .map(({ key, label }) => {
      const value = details[key];
      if (!isFilled(value)) return undefined;

      return { label, value } as MeetingPointInfoItem;
    })
    .filter((item): item is MeetingPointInfoItem => Boolean(item));

  return {
    ...details,
    info,
  };
}

export type NormalizedMeetingPoint = ReturnType<typeof createMeetingPoint>;
