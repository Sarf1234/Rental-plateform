"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, citySlug }) {

  if (!product) return null;

  const image =
    product.images?.[0] ||
    "https://via.placeholder.com/600x400?text=No+Image";

  const {
    minPrice,
    maxPrice,
    discountedPrice,
    unit,
  } = product.pricing || {};

  const hasDiscount =
    discountedPrice && discountedPrice < minPrice;

  const productUrl = `/${citySlug}/products/${product.slug}`
   

  return (
    <div className="group border border-gray-100 rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition duration-300">

      {/* IMAGE */}
      <Link href={productUrl}>
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={image}
            alt={product.title}
            fill
            className="object-fill group-hover:scale-105 transition duration-500"
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-5 space-y-4">

        <Link href={productUrl}>
          <h4 className="font-semibold text-gray-900 line-clamp-2">
            {product.title}
          </h4>
        </Link>

        <p className="text-xs text-gray-400">
          Code: {product.productCode}
        </p>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500">Starting From</p>

            {hasDiscount ? (
              <>
                <p className="line-through text-gray-400 text-sm">
                  ₹{minPrice}
                </p>
                <p className="text-2xl font-bold text-black">
                  ₹{discountedPrice}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-black">
                ₹{minPrice}
              </p>
            )}

            <p className="text-xs text-gray-500">
              per {unit}
            </p>
          </div>

          <Link href={productUrl}>
            <button className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition">
              Rent Now
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
