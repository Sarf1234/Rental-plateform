"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { apiRequest } from "@/lib/api";

const CityContext = createContext(null);

export function CityProvider({ children }) {
  const pathname = usePathname();

  const [city, setCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initCity() {
      try {

        /* ================= LOAD CITIES ================= */

        const res = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cities?page=1&limit=100`
        );

        const allCities = res?.data || [];

        setCities(allCities);

        const segments = pathname.split("/").filter(Boolean);
        const urlCitySlug = segments[0];

        /* ================= URL CITY ================= */

        const urlCity = allCities.find(
          (c) => c.slug === urlCitySlug
        );

        if (urlCity) {
          setCity(urlCity);

          localStorage.setItem(
            "selectedCity",
            JSON.stringify(urlCity)
          );

          setReady(true);
          return;
        }

        /* ================= LOCAL STORAGE ================= */

        const savedCity = localStorage.getItem("selectedCity");

        if (savedCity) {
          const parsed = JSON.parse(savedCity);
          setCity(parsed);
          setReady(true);
          return;
        }

        /* ================= DEFAULT ================= */

        const firstCity = allCities[0];

        if (firstCity) {
          setCity(firstCity);

          localStorage.setItem(
            "selectedCity",
            JSON.stringify(firstCity)
          );
        }

        setReady(true);

      } catch (err) {
        console.error("City init failed:", err);
        setReady(true);
      }
    }

    initCity();
  }, [pathname]);

  function updateCity(newCity) {
    setCity(newCity);

    localStorage.setItem(
      "selectedCity",
      JSON.stringify(newCity)
    );
  }

  return (
    <CityContext.Provider
      value={{ city, cities, updateCity, ready }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}