"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCity } from "@/context/CityContext";
import { apiRequest } from "@/lib/api";

export default function FooterServiceCategories() {
  const pathname = usePathname();
  const { city } = useCity();

  const [categories, setCategories] = useState([]);
  const [mounted, setMounted] = useState(false);

  /* ================= SAFE MOUNT ================= */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= CITY DETECTION ================= */

  const VALID_CITIES = [
    "mumbai",
    "delhi",
    "bangalore",
    "patna",
  ];

  const pathnameSafe = pathname || "";

  const segments = pathnameSafe
    .split("/")
    .filter(Boolean);

  const firstSegment = segments[0];

  const urlCity = VALID_CITIES.includes(
    firstSegment
  )
    ? firstSegment
    : null;

  const citySlug =
    urlCity || city?.slug || null;

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`
        );

        setCategories(
          res?.data || []
        );
      } catch (err) {
        console.error(
          "Footer categories fetch failed",
          err
        );
      }
    }

    fetchCategories();
  }, []);

  /* ================= BUILD CATEGORY HREF ================= */

  const buildCategoryHref = (slug) => {
    if (!citySlug) {
      return `/service-categories/${slug}`;
    }

    return `/${citySlug}/service-categories/${slug}`;
  };

  /* ================= BUILD ALL PRODUCTS HREF ================= */

  const buildAllProductsHref = () => {
    if (!citySlug) {
      return "/all-products";
    }

    return `/${citySlug}/all-products`;
  };

  /* ================= SAFETY RENDER ================= */

  if (
    !mounted ||
    !categories.length
  ) {
    return null;
  }

  return (
    <ul className="space-y-2 text-gray-600">

      {/* =========================================
          ALL RENTAL PRODUCTS
      ========================================= */}

      <li>
        <Link
          href={buildAllProductsHref()}
          className="
            font-medium
            text-gray-800
            transition
            hover:text-[#003459]
          "
        >
          All Rental Products
        </Link>
      </li>


      {/* =========================================
          SERVICE CATEGORIES
      ========================================= */}

      {categories
        .slice(3, 6)
        .map((cat) => (
          <li key={cat._id}>
            <Link
              href={buildCategoryHref(
                cat.slug
              )}
              className="
                transition
                hover:text-[#003459]
              "
            >
              {cat.name}
            </Link>
          </li>
        ))}

    </ul>
  );
}