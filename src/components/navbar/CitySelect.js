"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCity } from "@/context/CityContext";
import { apiRequest } from "@/lib/api";
import { MapPin, Search } from "lucide-react";

export default function CitySelect() {
  const { city, updateCity, ready } = useCity();

  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  function handleChange(selectedCity) {
    updateCity(selectedCity);

    const segments = (pathname || "").split("/").filter(Boolean);

    if (segments.length > 0) {
      segments[0] = selectedCity.slug;
      router.push("/" + segments.join("/"), { scroll: false });
    } else {
      router.push(`/${selectedCity.slug}`);
    }

    setOpen(false);
  }

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const popularCities = cities.slice(0, 6);

  if (!ready) return null;

  return (
    <>
      {/* TRIGGER */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 cursor-pointer px-3 py-2 hover:bg-gray-100 rounded-lg transition"
      >
        <MapPin size={18} />
        <span className="text-sm font-medium">
          {city?.name || "Select City"}
        </span>
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed px-2 inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/30">

          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 animate-[scaleIn_.2s_ease]">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Choose your city
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* SEARCH */}
            <div className="relative mb-5">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search for your city..."
                className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* POPULAR */}
            {!search && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Popular Cities
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {popularCities.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => handleChange(c)}
                      className="p-3 cursor-pointer rounded-xl border hover:border-black hover:bg-gray-50 transition text-sm font-medium"
                    >
                      
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ALL CITIES */}
            <div className="max-h-60  overflow-y-auto space-y-2 pr-1">
              {filteredCities.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => handleChange(c)}
                  className="w-full flex items-center justify-between px-4 py-3 border-1 cursor-pointer rounded-xl hover:bg-gray-100 transition text-sm"
                >
                  <span>{c.name}</span>
                  <MapPin size={14} className="text-gray-400" />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ANIMATION STYLE */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}