"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Home,
  Phone,
  BookOpen,
  User,
  ShoppingBag,
} from "lucide-react";
import CitySelect from "../navbar/CitySelect";

/* ================= NAV ITEMS ================= */

const NAV_ITEMS = [
  { name: "Home", slug: "/", icon: <Home size={18} /> },
  { name: "Products", slug: "/products", icon: <ShoppingBag size={18} /> },
  { name: "Blogs", slug: "/blogs", icon: <BookOpen size={18} /> },
  { name: "Contact Us", slug: "/contact", icon: <Phone size={18} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= DETECT CITY SLUG ================= */

  const citySlug = useMemo(() => {
    if (!pathname) return null;

    const parts = pathname.split("/");

    if (parts[1] === "city" && parts[2]) {
      return parts[2];
    }

    return null;
  }, [pathname]);

  /* ================= SCROLL EFFECT ================= */

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= ACTIVE STATE ================= */

  const isActive = (slug) => {
    if (slug === "/") {
      if (citySlug) {
        return pathname === `/city/${citySlug}`;
      }
      return pathname === "/";
    }

    if (slug === "/products") {
      if (citySlug) {
        return pathname === `/city/${citySlug}/products`;
      }
      return pathname === "/products";
    }

    return pathname === slug;
  };

  /* ================= SEARCH ================= */

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setOpen(false);
    }
  };

  /* ================= HEADER STYLE ================= */

  const headerStyle = `
    fixed top-0 z-50 w-full transition-all duration-300
    ${
      scrolled
        ? "bg-white border-b border-gray-200 shadow-md"
        : "bg-white"
    }
  `;

  return (
    <header className={headerStyle}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* ================= LOGO (City Aware Home) ================= */}
        <Link
          href={citySlug ? `/city/${citySlug}` : "/"}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Home size={22} />
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:block">
            Rent<span className="text-blue-600">Ease</span>
          </span>
        </Link>

        {/* ================= DESKTOP SEARCH ================= */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <form onSubmit={handleSearch} className="w-full relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search services or products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-4">
          <CitySelect />

          {/* ===== Desktop Nav ===== */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
            {NAV_ITEMS.map((item) => {
              let href = item.slug;

              if (item.slug === "/") {
                href = citySlug ? `/city/${citySlug}` : "/";
              }

              if (item.slug === "/products") {
                href = citySlug
                  ? `/city/${citySlug}/products`
                  : "/products";
              }

              return (
                <Link
                  key={item.slug}
                  href={href}
                  className={`px-4 py-2 rounded-md transition ${
                    isActive(item.slug)
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* ===== Desktop Login ===== */}
          <div className="hidden lg:flex items-center ml-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <User size={18} />
              <span className="text-sm font-medium">Login</span>
            </button>
          </div>

          {/* ===== Mobile Menu Button ===== */}
          <button
            aria-label="Open menu"
            className="lg:hidden text-gray-700"
            onClick={() => setOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">

          <div className="flex items-center justify-between p-4 border-b">
            <Link
              href={citySlug ? `/city/${citySlug}` : "/"}
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Home size={20} />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Rent<span className="text-blue-600">Ease</span>
              </span>
            </Link>

            <button onClick={() => setOpen(false)} className="p-2">
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="p-4 border-b">
            <form onSubmit={handleSearch} className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                let href = item.slug;

                if (item.slug === "/") {
                  href = citySlug ? `/city/${citySlug}` : "/";
                }

                if (item.slug === "/products") {
                  href = citySlug
                    ? `/city/${citySlug}/products`
                    : "/products";
                }

                return (
                  <Link
                    key={item.slug}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                      isActive(item.slug)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-gray-500">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t p-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} RentEase. All rights reserved.
          </div>
        </div>
      )}
    </header>
  );
}
