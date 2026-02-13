"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function FooterServiceCategories() {
  const params = useParams();
  const citySlug = params?.slug;

  const [categories, setCategories] = useState([]);

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

  if (!categories.length) return null;

  return (
    <ul className="space-y-2 text-gray-600">
      {categories.slice(3, 6).map((cat) => (
        <li key={cat._id}>
          <Link
            href={
              citySlug
                ? `/city/${citySlug}/service-categories/${cat.slug}`
                : `/service-categories/${cat.slug}`
            }
            className="hover:text-black transition"
          >
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
