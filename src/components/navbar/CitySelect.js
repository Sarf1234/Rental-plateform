"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCity } from "@/context/CityContext";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/api";

export default function CitySelect() {
  const { city, updateCity, ready } = useCity();
  const [cities, setCities] = useState([]);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cities?page=1&limit=100`
        );

        setCities(res?.data || []);
      } catch (error) {
        console.error("City load failed:", error);
      }
    }

    loadCities();
  }, []);

  function handleChange(slug) {
  const selectedCity = cities.find((c) => c.slug === slug);
  if (!selectedCity) return;

  updateCity(selectedCity);

  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "city") {
    // Replace only city slug
    segments[1] = selectedCity.slug;

    const newPath = "/" + segments.join("/");
    router.push(newPath);
  } else {
    // If not inside city route
    router.push(`/${selectedCity.slug}`);
  }
}


  if (!ready) return null;

  return (
  <div className="flex-shrink-0">
    <Select
      value={city?.slug || ""}
      onValueChange={handleChange}
    >
      <SelectTrigger className="
        w-auto
        min-w-[120px]
        max-w-[160px]
        h-10
        px-3
        border
        border-gray-300
        text-sm
      ">
        <SelectValue placeholder="City" />
      </SelectTrigger>

      <SelectContent>
        {cities.map((c) => (
          <SelectItem key={c.slug} value={c.slug}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

}
