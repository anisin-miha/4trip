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
import type { ExcursionCard, TourData } from "./types";

const excursionsList: readonly TourData[] = [
  patriotTour,
  sergievPosadTour,
  kolomnaTour,
  moscowSightseeingTour,
  zamoskvorechyeTour,
  bulgakovTour,
  legendsMoscowTour,
] as const;

export type Tour = TourData;
export type { ExcursionCard } from "./types";

export const excursions: Tour[] = [...excursionsList];
export const tours = excursions;

export const excursionCards: ExcursionCard[] = excursions
  .filter((tour) => tour.visibility)
  .map((tour) => ({
    slug: tour.slug,
    href: `/excursions/${tour.slug}`,
    title: tour.title,
    description: tour.hero.description,
    imageSrc: tour.hero.image,
    imageAlt: tour.title,
    price: tour.price,
    duration: tour.duration,
    languages: tour.languages,
    city: tour.city,
    meetingPoint: tour.meetingPoint.address,
    badges: tour.badges,
    rating: tour.rating,
    timeSlots: tour.meetingPoint.timeSlots,
  }));

export {
  moscowSightseeingTour,
  moscowSightseeingTourWithMeta,
  moscowSightseeingMetadata,
};
