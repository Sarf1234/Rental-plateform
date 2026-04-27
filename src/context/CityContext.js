"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { usePathname } from "next/navigation";

const CityContext = createContext(null);

export function CityProvider({
  children,
  initialCities = [],
}) {
  const pathname = usePathname();

  const [cities] = useState(initialCities);
  const [city, setCity] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!cities.length) return;

    const slug =
      pathname.split("/").filter(Boolean)[0];

    const routeCity = cities.find(
      (c) => c.slug === slug
    );

    if (routeCity) {
      setCity(routeCity);

      localStorage.setItem(
        "selectedCity",
        JSON.stringify(routeCity)
      );

      setReady(true);
      return;
    }

    const saved =
      localStorage.getItem("selectedCity");

    if (saved) {
      try {
        setCity(JSON.parse(saved));
        setReady(true);
        return;
      } catch {}
    }

    setCity(cities[0]);
    setReady(true);
  }, [pathname, cities]);

  const updateCity = (newCity) => {
    setCity(newCity);

    localStorage.setItem(
      "selectedCity",
      JSON.stringify(newCity)
    );
  };

  const value = useMemo(
    () => ({
      city,
      cities,
      ready,
      updateCity,
    }),
    [city, cities, ready]
  );

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}