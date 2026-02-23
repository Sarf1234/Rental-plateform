"use client";

import Link from "next/link";
import Image from "next/image";
import { useCity } from "@/context/CityContext";

export default function BlogRelatedServices({ services }) {
  const { city } = useCity();

  if (!city || !services?.length) return null;

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {services.map((service) => (
        <div
          key={service._id}
          className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition hover:shadow-lg hover:border-gray-300"
        >
          <Link href={`/${city.slug}/${service.slug}`}>
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src={service.images?.[0] || "/placeholder.png"}
                alt={service.title}
                fill
                sizes="(max-width:768px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
          </Link>

          <div className="p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">
              {service.title}
            </h3>

            <div className="flex items-center justify-between">
              {service.pricing?.label ? (
                <span className="text-sm text-gray-600">
                  {service.pricing.label}
                </span>
              ) : (
                <span className="text-sm text-gray-500">
                  On-site Service
                </span>
              )}

              <Link
                href={`/${city.slug}/${service.slug}`}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-black text-black hover:bg-black hover:text-white transition"
              >
                Book Service →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}