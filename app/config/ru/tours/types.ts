import type { Rating } from "@/app/components/ru/TourPage";

export enum MovementType {
  Bus = "bus",
  Pedestrian = "pedestrian",
}

export type ExcursionCard = {
  slug: string;
  href: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  price?: number | string;
  duration?: string;
  languages?: string[];
  city?: string;
  meetingPoint?: string;
  badges?: string[];
  rating?: Rating;
};
