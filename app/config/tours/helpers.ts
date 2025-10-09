export type MeetingPointInfoItem = {
  label: string;
  value: string;
};

export type MeetingPointDetails = {
  mapSrc: string;
  address: string;
  // New: array of available time slots (e.g. ["14:00", "16:00"]) for booking
  timeSlots?: string[];
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
  // timeSlots intentionally omitted from infoSources — rendered in booking form
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
