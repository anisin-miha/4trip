import TourCard from "./TourCard";
import {
  tours as legacyTours,
  moscowSightseeingTour,
  moscowSightseeingCard,
} from "@/app/config/ru/tours";
import { ruAccusativeAfterV } from "@/lib/utils";

type Props = {
  currentSlug: string;
  limit?: number;
};

type RelatedTourCard = {
  slug: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  price: number | string;
  duration?: string;
  languages?: string[];
  city?: string;
  meetingPoint?: string;
  badges?: string[];
  rating?: { value: number; count?: number };
};

export default function RelatedTours({ currentSlug, limit = 3 }: Props) {
  const legacyCards: RelatedTourCard[] = legacyTours.map((t) => ({
    slug: t.slug,
    href: `/excursions/${t.slug}`,
    imageSrc: t.hero.image,
    imageAlt: t.title,
    title: `Экскурсия в ${ruAccusativeAfterV(t.title)}`,
    description: t.hero.description,
    price: t.price,
    duration: t.duration,
    languages: t.languages,
    city: t.city,
    meetingPoint: t.meetingPoint.address,
  }));

  const modernCard: RelatedTourCard = {
    slug: moscowSightseeingTour.slug,
    href: moscowSightseeingCard.href,
    imageSrc: moscowSightseeingCard.imageSrc,
    imageAlt: moscowSightseeingCard.imageAlt,
    title: moscowSightseeingCard.title,
    description: moscowSightseeingCard.description,
    price: moscowSightseeingCard.price,
    duration: moscowSightseeingCard.duration,
    languages: moscowSightseeingCard.languages,
    city: moscowSightseeingCard.city,
    meetingPoint: moscowSightseeingCard.meetingPoint,
    badges: moscowSightseeingCard.badges,
    rating: moscowSightseeingCard.rating,
  };

  const related: RelatedTourCard[] = [...legacyCards, modernCard]
    .filter((tour) => tour.slug !== currentSlug)
    .slice(0, limit);

  if (!related.length) return null;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-10">Другие экскурсии</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {related.map((tour) => (
          <TourCard
            key={tour.slug}
            href={tour.href}
            imageSrc={tour.imageSrc}
            imageAlt={tour.imageAlt}
            title={tour.title}
            description={tour.description}
            price={tour.price}
            duration={tour.duration}
            languages={tour.languages}
            city={tour.city}
            meetingPoint={tour.meetingPoint}
            badges={tour.badges}
            rating={tour.rating}
          />
        ))}
      </div>
    </div>
  );
}
