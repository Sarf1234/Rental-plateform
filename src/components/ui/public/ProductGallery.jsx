"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images = [], title }) {
  const [activeImage, setActiveImage] = useState(images?.[0]);

  if (!images?.length) return null;

  return (
    <div className="w-full space-y-4">

      {/* ================= MAIN IMAGE ================= */}
      <div className="flex justify-center">
        <div className="
          relative 
          w-full 
          max-w-[500px] 
          md:max-w-[600px] 
          lg:max-w-full
          aspect-square 
          md:aspect-[5/3]
          rounded-2xl 
          overflow-hidden 
          border 
          bg-white
        ">
          <Image
            src={activeImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-contain"
          />
        </div>
      </div>

      {/* ================= THUMBNAILS ================= */}
      <div className="w-full overflow-hidden">

        <div className="flex gap-2 overflow-x-auto no-scrollbar">

          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`
                relative flex-shrink-0
                w-[22%] min-w-[70px] max-w-[90px]
                aspect-square
                rounded-xl overflow-hidden border
                transition
                ${
                  activeImage === img
                    ? "ring-2 ring-blue-50"
                    : "opacity-80 hover:opacity-100"
                }
              `}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-contain"
              />
            </button>
          ))}

        </div>
      </div>

    </div>
  );
}
