"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

const CityContext = createContext();

export function CityProvider({ children }) {
  const [city, setCity] = useState(null); // full city object
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initializeCity() {
      try {
        // ✅ 1️⃣ Check localStorage first
        const savedCity = localStorage.getItem("selectedCity");

        if (savedCity) {
          const parsedCity = JSON.parse(savedCity);
          setCity(parsedCity);
          setReady(true);
          return; // 🔥 STOP HERE — no API call
        }

        // ✅ 2️⃣ If no city in localStorage → call API
        const res = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cities?page=1&limit=100`
        );

        const cities = res?.data || [];

        if (!cities.length) {
          setReady(true);
          return;
        }

        // ✅ 3️⃣ Select first city
        const firstCity = cities[0];

        setCity(firstCity);
        localStorage.setItem(
          "selectedCity",
          JSON.stringify(firstCity)
        );

        setReady(true);
      } catch (error) {
        console.error("City initialization failed:", error);
        setReady(true);
      }
    }

    initializeCity();
  }, []);

  function updateCity(newCityObject) {
    setCity(newCityObject);
    localStorage.setItem(
      "selectedCity",
      JSON.stringify(newCityObject)
    );
  }

  return (
    <CityContext.Provider value={{ city, updateCity, ready }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
