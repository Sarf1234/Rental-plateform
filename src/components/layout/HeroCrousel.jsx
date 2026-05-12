"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import useEmblaCarousel from "embla-carousel-react";

import Autoplay from "embla-carousel-autoplay";

export default function HeroCarousel({
  banners = [],
}) {

  const autoplay =
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });

  const [emblaRef, emblaApi] =
    useEmblaCarousel(
      {
        loop: true,
        align: "start",
      },
      [autoplay]
    );

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [loadedImages, setLoadedImages] =
    useState({});

  /* -------------------------------- */
  /* EMBLA SELECT */
  /* -------------------------------- */

  const onSelect =
    useCallback(() => {

      if (!emblaApi) return;

      setSelectedIndex(
        emblaApi.selectedScrollSnap()
      );

    }, [emblaApi]);

  useEffect(() => {

    if (!emblaApi) return;

    emblaApi.on(
      "select",
      onSelect
    );

    onSelect();

  }, [
    emblaApi,
    onSelect,
  ]);

  /* -------------------------------- */
  /* IMAGE LOAD */
  /* -------------------------------- */

  function handleImageLoad(index) {

    setLoadedImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  }

  /* -------------------------------- */
  /* EMPTY */
  /* -------------------------------- */

  if (!banners?.length) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto md:px-4 mt-16 md:mt-20">

      <div
        ref={emblaRef}
        className="overflow-hidden md:rounded-3xl"
      >

        <div className="flex">

          {banners.map(
            (banner, i) => {

              const isLoaded =
                loadedImages[i];

              return (
                <div
                  key={banner._id || i}
                  className="relative min-w-full h-[45vh] md:h-[78vh] bg-gray-100 overflow-hidden"
                >

                  {/* IMAGE SKELETON */}

                  {!isLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200" />
                  )}

                  {/* IMAGE */}

                  <picture>

                    {banner.mobileImage && (
                      <source
                        media="(max-width:768px)"
                        srcSet={banner.mobileImage}
                      />
                    )}

                    <img
                      src={banner.desktopImage}
                      alt={banner.title}
                      loading={i === 0 ? "eager" : "lazy"}
                      onLoad={() =>
                        handleImageLoad(i)
                      }
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                        isLoaded
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                    />

                  </picture>

                  {/* OVERLAY */}

                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

                  {/* CONTENT */}

                  <div className="relative z-10 h-full flex items-center">

                    <div className="w-full max-w-7xl mx-auto px-5 md:px-10">

                      <div className="max-w-2xl">

                        {/* SMALL LABEL */}

                        {/* <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 text-white/90 text-xs md:text-sm font-medium mb-5">

                          Trusted Rental Marketplace

                        </div> */}

                        {/* TITLE */}

                        <h1 className="text-white font-bold leading-[1.08] tracking-tight text-[2rem] sm:text-5xl md:text-6xl">

                          {banner.title}

                        </h1>

                        {/* SUBTITLE */}

                        {banner.subtitle && (
                          <p className="mt-5 text-white/90 text-base md:text-xl leading-relaxed max-w-xl">

                            {banner.subtitle}

                          </p>
                        )}

                        {/* DESCRIPTION */}

                        {banner.description && (
                          <p className="hidden md:block mt-5 text-white/70 text-base leading-relaxed max-w-2xl">

                            {banner.description}

                          </p>
                        )}

                        {/* CTA */}

                        {banner.buttonText &&
                          banner.buttonLink && (

                            <div className="mt-8">

                              <Link
                                href={banner.buttonLink}
                                className="inline-flex items-center justify-center h-12 md:h-14 px-6 md:px-8 rounded-xl bg-[#E8B44C] hover:bg-[#d8a63f] text-white font-semibold transition-all duration-300 shadow-lg"
                              >

                                {banner.buttonText}

                              </Link>

                            </div>
                          )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* DOTS */}

      {banners.length > 1 && (

        <div className="flex items-center justify-center gap-2 mt-5">

          {banners.map(
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  emblaApi?.scrollTo(index)
                }
                className={`rounded-full transition-all duration-300 ${
                  selectedIndex === index
                    ? "w-8 h-2 bg-black"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            )
          )}

        </div>

      )}

    </section>
  );
}