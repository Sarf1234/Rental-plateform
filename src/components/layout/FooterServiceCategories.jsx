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

  /* ================= CITY DETECTION ================= */

  const VALID_CITIES = ["mumbai", "delhi", "bangalore", "patna"];

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  const urlCity = VALID_CITIES.includes(firstSegment)
    ? firstSegment
    : null;

  const citySlug = urlCity || city?.slug;

  /* ================= FETCH ================= */

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`
        );
        setCategories(res?.data || []);
      } catch (err) {
        console.error("Footer categories fetch failed");
      }
    }

    fetchCategories();
  }, []);

  /* ================= BUILD HREF ================= */

  const buildCategoryHref = (slug) => {
    if (!citySlug) return `/service-categories/${slug}`;
    return `/${citySlug}/service-categories/${slug}`;
  };

  if (!categories.length) return null;

  return (
    <ul className="space-y-2 text-gray-600">
      {categories.slice(3, 6).map((cat) => (
        <li key={cat._id}>
          <Link
            href={buildCategoryHref(cat.slug)}
            className="hover:text-black transition"
          >
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}