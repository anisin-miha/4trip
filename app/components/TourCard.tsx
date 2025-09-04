"use client";

import { Link, useRouter } from "@/i18n/navigation";
import BaseImage from "@/components/BaseImage";

type Rating = {
  value: number;
  count?: number;
};

type TourCardProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  price?: number | string;
  duration?: string;
  languages?: string[];
  city?: string;
  meetingPoint?: string;
  badges?: string[];
  rating?: Rating;
};

export default function TourCard({
  href,
  imageSrc,
  imageAlt,
  title,
  description,
  price,
  duration,
  languages,
  city,
  meetingPoint,
  badges,
  rating,
}: TourCardProps) {
  const router = useRouter();
  const priceText =
    typeof price === "number"
      ? `${price.toLocaleString("ru-RU")} ₽`
      : price;

  const go = () => router.push(href);

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={title}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      }}
      className="tour-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition bg-white flex flex-col cursor-pointer group"
    >
      <div className="tour-card__image-wrapper relative h-64">
        <BaseImage
          src={imageSrc}
          alt={imageAlt}
          fill
          width={640}
          className="tour-card__image object-cover"
        />
        {badges && badges.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-2">
            {badges.map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="bg-blue-600/90 text-white text-xs font-semibold px-2 py-1 rounded"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        {rating && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
            ★ {rating.value.toFixed(1)}
            {typeof rating.count === "number" && <span className="opacity-80"> ({rating.count})</span>}
          </div>
        )}
      </div>

      <div className={`tour-card__content p-4 flex flex-col gap-3 flex-1`}>
        <Link href={href} className="block" onClick={(e) => e.stopPropagation()}>
          <h3 className="tour-card__title text-xl font-semibold group-hover:underline">
            {title}
          </h3>
        </Link>
        <p className="tour-card__description text-gray-600">{description}</p>

        {(duration || (languages && languages.length) || city || meetingPoint) && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            {duration && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded">
                <span className="opacity-70">⏱</span> {duration}
              </span>
            )}
            {languages && languages.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded">
                <span className="opacity-70">🌐</span> {languages.join(", ")}
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded">
                <span className="opacity-70">🏙️</span> {city}
              </span>
            )}
            {meetingPoint && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded max-w-full truncate">
                <span className="opacity-70">📍</span>
                <span className="truncate" title={meetingPoint}>
                  {meetingPoint}
                </span>
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-2">
          {priceText && (
            <div className="text-gray-900 leading-none mb-2">
              <span className="text-xs text-gray-500 mr-1">от</span>
              <span className="text-base font-semibold">{priceText}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Link
              href={href}
              onClick={(e) => e.stopPropagation()}
              className="hidden lg:inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Подробнее
            </Link>
            <Link
              href={`${href}#booking`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-md border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition"
            >
              Забронировать
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
