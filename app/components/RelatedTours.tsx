import TourCard from "./TourCard";
import { tours } from "@/app/config/tours";
import { ruAccusativeAfterV } from "@/lib/utils";

type Props = {
  currentSlug: string;
  limit?: number;
};

const pickInfo = (
  arr: { label: string; value: string }[],
  label: string,
): string | undefined => arr.find((i) => i.label === label)?.value;

export default function RelatedTours({ currentSlug, limit = 3 }: Props) {
  const related = tours.filter((t) => t.slug !== currentSlug).slice(0, limit);

  if (!related.length) return null;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-10">Другие экскурсии</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {related.map((t) => {
          const duration = pickInfo(t.meetingPoint.info, "Длительность");
          const lang = pickInfo(t.meetingPoint.info, "Язык экскурсии");
          const meeting = pickInfo(t.meetingPoint.info, "Место встречи");

          return (
            <TourCard
              key={t.slug}
              href={`/${t.slug}`}
              imageSrc={t.hero.image}
              imageAlt={t.title}
              title={`Экскурсия в ${ruAccusativeAfterV(t.title)}`}
              description={t.hero.description}
              price={t.price}
              duration={duration}
              languages={lang ? [lang] : undefined}
              meetingPoint={meeting}
            />
          );
        })}
      </div>
    </div>
  );
}
