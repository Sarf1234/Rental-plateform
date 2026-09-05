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
    discountedPrice,
    unit,
  } = product.pricing || {};

  const hasDiscount =
    discountedPrice &&
    minPrice &&
    discountedPrice < minPrice;

  const productUrl = `/${citySlug}/products/${product.slug}`;

  return (
    <div
      className="
        group
        h-full
        overflow-hidden
        border
        border-gray-100
        rounded-2xl
        bg-white

        hover:shadow-xl
        hover:-translate-y-1

        transition
        duration-300
      "
    >
      {/* IMAGE */}
      <Link href={productUrl}>
        <div
          className="
            relative
            h-44
            sm:h-52
            md:h-56

            w-full
            overflow-hidden
          "
        >
          <Image
            src={image}
            alt={product.title || "Rental product"}
            fill
            sizes="
              (max-width: 640px) 50vw,
              (max-width: 1024px) 33vw,
              25vw
            "
            className="
              object-fill
              group-hover:scale-105
              transition
              duration-500
            "
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div
        className="
          p-3
          sm:p-4
          md:p-5

          space-y-2
          sm:space-y-3
          md:space-y-4
        "
      >
        {/* TITLE */}
        <Link href={productUrl}>
          <h4
            className="
              font-semibold
              text-gray-900
              line-clamp-2

              text-[13px]
              sm:text-sm
              md:text-base

              leading-[1.3]
            "
          >
            {product.title}
          </h4>
        </Link>

        {/* PRODUCT CODE */}
        {product.productCode && (
          <p
            className="
              text-[10px]
              sm:text-[11px]
              md:text-xs

              text-gray-400

              truncate
            "
          >
            Code: {product.productCode}
          </p>
        )}

        {/* PRICE + BUTTON */}
        <div
          className="
            flex
            items-end
            justify-between

            gap-2
          "
        >
          {/* PRICE */}
          <div className="min-w-0">
            <p
              className="
                text-[10px]
                sm:text-[11px]
                md:text-xs

                text-gray-500
              "
            >
              Starting From
            </p>

            {hasDiscount ? (
              <>
                <p
                  className="
                    text-[11px]
                    sm:text-xs
                    md:text-sm

                    text-gray-400
                    line-through
                  "
                >
                  ₹{minPrice}
                </p>

                <p
                  className="
                    text-xs
                    sm:text-sm
                    md:text-lg

                    font-bold
                    leading-none

                    text-black
                  "
                >
                  ₹{discountedPrice}
                </p>
              </>
            ) : (
              <p
                className="
                  text-xs
                  sm:text-xl
                  md:text-2xl

                  font-bold
                  leading-none

                  text-black
                "
              >
                ₹{minPrice}
              </p>
            )}

            <p
              className="
                mt-0.5

                text-[10px]
                sm:text-[11px]
                md:text-xs

                text-gray-500
              "
            >
              per {unit}
            </p>
          </div>

          {/* BUTTON */}
          <Link
            href={productUrl}
            className="
              inline-flex
              flex-shrink-0

              items-center
              justify-center

              px-2.5
              sm:px-3
              md:px-4

              py-1.5
              sm:py-2

              text-[10px]
              sm:text-xs
              md:text-sm

              font-medium

              rounded-lg

              border
              border-black

              text-black

              whitespace-nowrap

              hover:bg-black
              hover:text-white

              transition
            "
          >
            Rent Now →
          </Link>
        </div>
      </div>
    </div>
  );
}