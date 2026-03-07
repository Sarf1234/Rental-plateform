"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images = [], title }) {
  const galleryImages = images?.slice(0, 4) || [];
  const [activeImage, setActiveImage] = useState(galleryImages?.[0]);

  if (!galleryImages.length) return null;

  const handleImageChange = (img) => {
    setActiveImage(img);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4">

        {/* ================= THUMBNAILS ================= */}
        <div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar md:w-[90px]">

          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => handleImageChange(img)}          // mobile tap
              onMouseEnter={() => handleImageChange(img)}     // desktop hover
              onTouchStart={() => handleImageChange(img)}     // mobile touch
              className={`
                relative flex-shrink-0
                w-[65px] h-[65px]
                md:w-[90px] md:h-[90px]
                rounded-xl
                overflow-hidden
                border
                transition-all
                duration-200
                ${
                  activeImage === img
                    ? "ring-1 ring-gray-200"
                    : "opacity-80 hover:opacity-100"
                }
              `}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="90px"
                className="object-cover object-center"
              />
            </button>
          ))}

        </div>

        {/* ================= MAIN IMAGE ================= */}
        <div
          className="
            order-1 md:order-2
            group
            relative
            flex-1
            aspect-square
            md:aspect-[5/3]
            rounded-2xl
            overflow-hidden
            border
            bg-gray-200
          "
        >
          <Image
            src={activeImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 700px"
            className="
              object-cover
              md:object-contain
              object-center
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        </div>

      </div>
    </div>
  );
}