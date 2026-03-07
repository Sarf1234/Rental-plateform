"use client";

import { useState } from "react";
import Image from "next/image";

export default function ServiceGallery({ images }) {
  const galleryImages = images?.slice(0, 4) || [];
  const [active, setActive] = useState(0);

  if (!images?.length) return null;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">

      <div className="flex flex-col lg:flex-row gap-4">

        {/* MAIN IMAGE */}
        <div className="relative w-full lg:flex-1 h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] rounded-xl overflow-hidden group">

          <Image
            src={galleryImages[active]}
            alt="service image"
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-cover group-hover:scale-105 transition duration-500"
            priority
          />

        </div>

        {/* THUMBNAILS */}
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">

          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-[70px] h-[70px] lg:w-[90px] lg:h-[90px] rounded-lg overflow-hidden border transition ${
                active === i
                  ? "border-black"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img}
                alt="thumbnail"
                fill
                className="object-cover"
              />
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}