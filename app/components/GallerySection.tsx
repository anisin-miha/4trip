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
    <section id="gallery" className="py-16 bg-gray-100 scroll-mt-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>

        <div className="grid md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className="focus:outline-none"
            >
              <BaseImage
                src={img.src}
                alt={img.alt}
                width={300}
                height={200}
                className="w-full h-64 object-cover rounded-lg"
              />
            </button>
          ))}
        </div>

        <Lightbox
          open={index !== undefined}
          close={() => setIndex(undefined)}
          slides={images.map((img) => ({ src: img.src, alt: img.alt }))}
          index={index}
          on={{ view: ({ index }) => setIndex(index) }}
        />
      </div>
    </section>
  );
}
