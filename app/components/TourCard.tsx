import Link from "next/link";
import BaseImage from "@/components/BaseImage";

type TourCardProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
};

export default function TourCard({
  href,
  imageSrc,
  imageAlt,
  title,
  description,
}: TourCardProps) {
  return (
    <Link
      href={href}
      className="tour-card block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
    >
      <div className="tour-card__image-wrapper relative h-64">
        <BaseImage
          src={imageSrc}
          alt={imageAlt}
          fill
          className="tour-card__image object-cover"
        />
      </div>
      <div className="tour-card__content p-4">
        <h3 className="tour-card__title text-xl font-semibold mb-2">{title}</h3>
        <p className="tour-card__description text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
