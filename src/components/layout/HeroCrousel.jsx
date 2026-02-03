"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

export default function HeroCarousel({ images, contents }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <section className="max-w-7xl mx-auto md:px-4 mt-20">
      <div
        className="relative overflow-hidden rounded-xl h-[40vh] md:h-[70vh]"
        ref={emblaRef}
      >
        <div className="flex h-full">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative w-full flex-shrink-0 h-full"
            >
              {/* Background Image */}
              <Image
                src={src}
                alt={`Slide ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-6">
                
                <h2 className="text-white md:block hidden font-bold text-xl sm:text-4xl md:text-5xl max-w-3xl">
                  {contents[i].title}
                </h2>

                <p className="text-white/90 md:block hidden mt-4 text-sm sm:text-lg max-w-2xl">
                  {contents[i].desc}
                </p>

                <a
                  href={contents[i].link}
                  target="_blank"
                  className="mt-6 px-6 md:block hidden py-3 bg-[#E8B44C] text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition"
                >
                  {contents[i].cta}
                </a>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
