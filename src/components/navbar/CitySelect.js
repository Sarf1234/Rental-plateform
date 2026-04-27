"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCity } from "@/context/CityContext";
import { apiRequest } from "@/lib/api";
import { MapPin, Search } from "lucide-react";

export default function CitySelect() {
  const { city, cities, updateCity, ready } = useCity();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const router = useRouter();
  const pathname = usePathname();



  /* CHANGE CITY */
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
        className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
      >
        <MapPin size={18} />
        <span className="text-sm font-medium">
          {city?.name || "Select City"}
        </span>
      </button>

      {open && (
        <>
          {/* OVERLAY */}
          <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* DESKTOP MODAL */}
          <div className="hidden md:flex fixed inset-0 z-[101] items-center justify-center">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 animate-scaleIn">

              <Header close={() => setOpen(false)} />
              <SearchBar search={search} setSearch={setSearch} />

              {!search && (
                <PopularCities cities={popularCities} onSelect={handleChange} />
              )}

              <CityList cities={filteredCities} onSelect={handleChange} />
            </div>
          </div>

          {/* MOBILE BOTTOM SHEET */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl p-5 animate-slideUp max-h-[85vh] overflow-hidden">

            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

            <Header close={() => setOpen(false)} />
            <SearchBar search={search} setSearch={setSearch} />

            <div className="overflow-y-auto max-h-[60vh] pr-1">
              {!search && (
                <PopularCities cities={popularCities} onSelect={handleChange} />
              )}
              <CityList cities={filteredCities} onSelect={handleChange} />
            </div>
          </div>
        </>
      )}

      {/* ANIMATIONS */}
      <style jsx>{`
        .animate-scaleIn {
          animation: scaleIn 0.2s ease;
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

/* ================= COMPONENTS ================= */

function Header({ close }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Select your city</h2>
      <button onClick={close}>✕</button>
    </div>
  );
}

function SearchBar({ search, setSearch }) {
  return (
    <div className="relative mb-4">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder="Search city..."
        className="w-full pl-9 pr-3 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

function PopularCities({ cities, onSelect }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm text-gray-500 mb-2">Popular Cities</h3>
      <div className="grid grid-cols-3 gap-3">
        {cities.map((c) => (
          <button
            key={c.slug}
            onClick={() => onSelect(c)}
            className="p-3 border rounded-xl hover:bg-gray-50"
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function CityList({ cities, onSelect }) {
  return (
    <div className="space-y-2">
      {cities.map((c) => (
        <button
          key={c.slug}
          onClick={() => onSelect(c)}
          className="w-full flex justify-between px-4 py-3 rounded-xl hover:bg-gray-100 text-sm"
        >
          {c.name}
          <MapPin size={14} className="text-gray-400" />
        </button>
      ))}
    </div>
  );
}