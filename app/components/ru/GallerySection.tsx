"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import BaseImage from "@/components/BaseImage"; // твой компонент для изображений

interface GallerySectionProps {
  title: string;
  images: {
    src: string;
    alt: string;
  }[];
}

export default function GallerySection({ title, images }: GallerySectionProps) {
  const [index, setIndex] = useState<number | undefined>(undefined);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>

      <div className="grid md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className="focus:outline-none"
            style={{ height: 240 }}
          >
            <BaseImage
              src={img.src}
              alt={img.alt}
              title={img.alt}
              width={384}
              fill
              className="w-full h-64 object-cover rounded-lg"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index !== undefined}
        close={() => setIndex(undefined)}
        slides={images.map((img) => ({
          src: img.src,
          alt: img.alt,
        }))}
        index={index}
        on={{ view: ({ index }) => setIndex(index) }}
      />
    </div>
  );
}
