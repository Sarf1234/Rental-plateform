"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images = [], title }) {
  const [activeImage, setActiveImage] = useState(images?.[0]);

  if (!images?.length) return null;

  return (
    <div className="space-y-4">

      {/* Main Image */}
      <div className="relative h-[450px] rounded-2xl overflow-hidden border">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setActiveImage(img)}
            className={`relative h-20 w-24 rounded-xl overflow-hidden border cursor-pointer transition ${
              activeImage === img ? "ring-1 ring-blue-200" : ""
            }`}
          >
            <Image
              src={img}
              alt="thumb"
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>

    </div>
  );
}
