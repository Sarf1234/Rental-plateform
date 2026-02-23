"use client";

import Link from "next/link";
import Image from "next/image";
import { useCity } from "@/context/CityContext";

export default function BlogRelatedProducts({ products }) {
  const { city } = useCity();

  if (!city || !products?.length) return null;

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {products.map((product) => {
        const price =
          product.pricing?.discountedPrice ||
          product.pricing?.minPrice;

        return (
          <div
            key={product._id}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition hover:shadow-lg hover:border-gray-300"
          >
            <Link href={`/${city.slug}/products/${product.slug}`}>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.title}
                  fill
                  sizes="(max-width:768px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            </Link>

            <div className="p-5 space-y-4">
              <h4 className="font-semibold text-gray-900 line-clamp-2 leading-snug">
                {product.title}
              </h4>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#003459]">
                  ₹{price}
                </span>

                <Link
                  href={`/${city.slug}/products/${product.slug}`}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-black text-black hover:bg-black hover:text-white transition"
                >
                  Rent Now →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}