import { patriotTour } from "./patriot";
import { sergievPosadTour } from "./sergiev-posad";
import { kolomnaTour } from "./kolomna";
import {
  moscowSightseeingTour,
  moscowSightseeingTourWithMeta,
  moscowSightseeingMetadata,
} from "./moscow-sightseeing";
import { tour as zamoskvorechyeTour } from "./moskva-kupecheskaya-progulka-po-zamoskvorechyu";
import { tour as bulgakovTour } from "./bulgakovskaya-moskva-po-sledam-mastera-i-margarita";
import { tour as legendsMoscowTour } from "./legendy-staroy-moskvy-kitay-gorod-i-hitrovka";
import type { Rating } from "@/app/components/ru/TourPage";
import type { ExcursionCard, MovementType } from "./types";

const excursionsList = [
  patriotTour,
  sergievPosadTour,
  kolomnaTour,
  moscowSightseeingTour,
  zamoskvorechyeTour,
  bulgakovTour,
  legendsMoscowTour,
] as const;

type RawTour = (typeof excursionsList)[number];

export type Tour = RawTour & {
  city?: string;
  location?: string;
  rating?: Rating;
  visibility: boolean;
  movementType: MovementType;
  badges?: string[];
};
export type { ExcursionCard } from "./types";

export const excursions: Tour[] = excursionsList as unknown as Tour[];
export const tours = excursions;

export const excursionCards: ExcursionCard[] = excursions
  .filter((tour) => tour.visibility)
  .map((tour) => ({
    slug: tour.slug,
    href: `/excursions/${tour.slug}`,
    title: tour.title,
    description: tour.hero?.description ?? "",
    imageSrc: tour.hero?.image ?? "",
    imageAlt: tour.title,
    price: tour.price,
    duration: tour.duration ?? tour.meetingPoint?.duration,
    languages:
      tour.languages ??
      (tour.meetingPoint?.language ? [tour.meetingPoint.language] : undefined),
    city: tour.city,
    meetingPoint: tour.meetingPoint?.address,
    badges: tour.badges,
    rating: tour.rating,
  }));

export {
  moscowSightseeingTour,
  moscowSightseeingTourWithMeta,
  moscowSightseeingMetadata,
};
