import type {
  MeetingPoint,
  MeetingPointDetails,
  MeetingPointInfoItem,
} from "./types";

type MeetingPointInfoKey = "address" | "endAddress";

const infoSources: Array<{ key: MeetingPointInfoKey; label: string }> = [
  { key: "address", label: "Место встречи" },
  { key: "endAddress", label: "Место окончания" },
];

function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function createMeetingPoint(details: MeetingPointDetails): MeetingPoint {
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

export type NormalizedMeetingPoint = MeetingPoint;
