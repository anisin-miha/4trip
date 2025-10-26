import TourCard from "./TourCard";
import { excursions } from "@/app/config/ru/tours";
import { ruAccusativeAfterV } from "@/lib/utils";

type Props = {
  currentSlug: string;
  limit?: number;
};

export default function RelatedTours({ currentSlug, limit = 3 }: Props) {
  const related = excursions
    .filter((tour) => tour.slug !== currentSlug)
    .map((tour) => {
      const languages =
        tour.languages ??
        (tour.meetingPoint?.language
          ? [tour.meetingPoint.language]
          : undefined);
      return {
        slug: tour.slug,
        href: `/excursions/${tour.slug}`,
        imageSrc: tour.hero.image,
        imageAlt: tour.title,
        title: `Экскурсия в ${ruAccusativeAfterV(tour.title)}`,
        description: tour.hero.description,
        price: tour.price,
        duration: tour.duration ?? tour.meetingPoint?.duration,
        languages,
        city: tour.city,
        meetingPoint: tour.meetingPoint?.address,
        badges: tour.badges,
        rating: tour.rating,
      };
    })
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
