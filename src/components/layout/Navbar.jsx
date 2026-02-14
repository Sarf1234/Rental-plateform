"use client";

import React, { useState, useEffect } from "react";
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
import { useCity } from "@/context/CityContext";
import Image from "next/image";

/* ================= NAV ITEMS ================= */

const NAV_ITEMS = [
  { name: "Home", slug: "/" },
  { name: "Products", slug: "/products" },
  { name: "Blogs", slug: "/blog" },
  // { name: "Contact Us", slug: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { city, ready } = useCity();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const citySlug = city?.slug;

  /* ================= SCROLL EFFECT ================= */

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= BUILD HREF ================= */

  const buildHref = (slug) => {
    if (!ready) return "#";

    if (slug === "/") {
      return citySlug ? `/city/${citySlug}` : "/";
    }

    if (slug === "/products") {
      return citySlug
        ? `/city/${citySlug}/products`
        : "/products";
    }

    return slug;
  };

  /* ================= ACTIVE STATE ================= */

  const isActive = (slug) => {
    if (!ready) return false;

    if (slug === "/") {
      return citySlug
        ? pathname === `/city/${citySlug}`
        : pathname === "/";
    }

    if (slug === "/products") {
      return citySlug
        ? pathname === `/city/${citySlug}/products`
        : pathname === "/products";
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

        {/* ================= LOGO ================= */}
        <Link
          href={buildHref("/")}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Home size={22} />
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:block">
            Kiray<span className="text-blue-600">Now</span>
          </span>
          {/* <Image
    src="https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp" // 👉 change this
    alt="KirayNow Logo"
    width={60}
    height={20}
    priority
    className="object-contain"
  /> */}
          {/* <Image src='https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp' className="w-10 h-10" /> */}
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
              placeholder="Search rental products..."
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={buildHref(item.slug)}
                className={`px-4 py-2 rounded-md transition ${
                  isActive(item.slug)
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* ===== Desktop Login ===== */}
          <div className="hidden lg:flex items-center ml-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Phone size={18} />
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

          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link
              href={buildHref("/")}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <Home size={20} />
              <span className="font-bold">RentEase</span>
            </Link>

            <button onClick={() => setOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Mobile Search */}
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

          {/* Mobile Nav Links */}
          <div className="flex flex-col h-full">

  {/* MENU ITEMS */}
  <div className="flex-1 overflow-y-auto p-4 space-y-1">
    {NAV_ITEMS.map((item) => (
      <Link
        key={item.slug}
        href={buildHref(item.slug)}
        onClick={() => setOpen(false)}
        className={`block px-4 py-3 rounded-lg transition ${
          isActive(item.slug)
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {item.name}
      </Link>
    ))}
  </div>

  {/* CALL BUTTON SECTION */}
  <div className="p-4 border-t bg-white">
    <a
      href="tel:8839931558"
      onClick={() => setOpen(false)}
      className="flex items-center justify-center gap-2 w-full bg-blue-800 text-white py-3 rounded-xl font-medium shadow-md hover:scale-[1.02] transition duration-200"
    >
      <Phone size={18} />
      Call Us
    </a>
  </div>

</div>

          {/* Footer */}
          <div className="border-t p-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} RentEase. All rights reserved.
          </div>
        </div>
      )}
    </header>
  );
}
