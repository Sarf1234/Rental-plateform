"use client";

import React, {
  useState,
  useEffect,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Menu,
  X,
  Search,
  Phone,
} from "lucide-react";

import CitySelect from "../navbar/CitySelect";
import { useCity } from "@/context/CityContext";

/* =========================
   NAV ITEMS
========================= */

const NAV_ITEMS = [
  {
    name: "Home",
    slug: "/",
  },
  {
    name: "Products",
    slug: "/products",
  },
  {
    name: "Blogs",
    slug: "/blog",
  },
];

export default function Navbar() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const {
    city,
    ready,
  } = useCity();

  const [mounted, setMounted] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const queryCity =
    searchParams.get(
      "city"
    );

  const VALID_CITIES = [
    "mumbai",
    "delhi",
    "bangalore",
    "patna",
  ];

  const pathnameSafe =
    pathname || "";

  const segments =
    pathnameSafe
      .split("/")
      .filter(Boolean);

  const firstSegment =
    segments[0];

  const urlCity =
    VALID_CITIES.includes(
      firstSegment
    )
      ? firstSegment
      : null;

  /* =========================
     HYDRATION SAFE
  ========================= */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =========================
     SCROLL EFFECT
  ========================= */

  useEffect(() => {
    const onScroll =
      () =>
        setScrolled(
          window.scrollY >
            40
        );

    window.addEventListener(
      "scroll",
      onScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, []);

  /* =========================
     CITY SLUG SAFE
  ========================= */

  const citySlug =
    mounted
      ? urlCity ||
        city?.slug ||
        queryCity ||
        null
      : null;

  /* =========================
     BUILD LINKS
  ========================= */

  function buildHref(
    slug
  ) {
    if (
      !mounted ||
      !ready
    )
      return "/";

    if (slug === "/") {
      return "/";
    }


    if (
      slug ===
      "/products"
    ) {
      return citySlug
        ? `/${citySlug}/products`
        : "/products";
    }

    return slug;
  }

  /* =========================
     ACTIVE STATE
  ========================= */

  function isActive(
    slug
  ) {
    if (
      !mounted ||
      !ready
    )
      return false;

    if (slug === "/") {
      return citySlug
        ? pathname ===
            `/${citySlug}`
        : pathname ===
            "/";
    }

    if (
      slug ===
      "/products"
    ) {
      return citySlug
        ? pathname ===
            `/${citySlug}/products`
        : pathname ===
            "/products";
    }

    return (
      pathname === slug
    );
  }

  /* =========================
     SEARCH
  ========================= */

  function handleSearch(
    e
  ) {
    e.preventDefault();

    if (
      !searchQuery.trim()
    )
      return;

    const params =
      new URLSearchParams();

    params.set(
      "q",
      searchQuery
    );

    if (citySlug) {
      params.set(
        "city",
        citySlug
      );
    }

    router.push(
      `/search?${params.toString()}`
    );

    setSearchQuery("");
    setOpen(false);
  }

  /* =========================
     STYLE
  ========================= */

  const headerStyle = `
    fixed top-0 z-50 w-full transition-all duration-300
    ${
      scrolled
        ? "bg-white border-b border-gray-200 shadow-md"
        : "bg-white"
    }
  `;

  return (
    <header
      className={
        headerStyle
      }
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href={buildHref(
            "/"
          )}
          className="flex items-center flex-shrink-0"
        >
          <Image
            src="https://res.cloudinary.com/dlwcvgox7/image/upload/v1771352145/posts/hjrudbleo4u5omzm3ami.png"
            alt="KirayNow Logo"
            width={120}
            height={32}
            priority
            className="object-contain h-8 w-auto"
          />
        </Link>

        {/* SEARCH DESKTOP */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <form
            onSubmit={
              handleSearch
            }
            className="w-full relative"
          >
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search rental products..."
              value={
                searchQuery
              }
              onChange={(
                e
              ) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          <CitySelect />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
            {NAV_ITEMS.map(
              (
                item
              ) => (
                <Link
                  key={
                    item.slug
                  }
                  href={buildHref(
                    item.slug
                  )}
                  className={`px-4 py-2 rounded-md transition ${
                    isActive(
                      item.slug
                    )
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  {
                    item.name
                  }
                </Link>
              )
            )}
          </nav>

          {/* Call Button */}
          <div className="hidden lg:flex">
            <a
              href="tel:7672876321"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Phone
                size={18}
              />
              <span className="text-sm font-medium">
                Call
                Us
              </span>
            </a>
          </div>

          {/* Mobile Menu */}
          <button
            aria-label="Open Menu"
            className="lg:hidden"
            onClick={() =>
              setOpen(
                true
              )
            }
          >
            <Menu
              size={24}
            />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link
              href={buildHref(
                "/"
              )}
              onClick={() =>
                setOpen(
                  false
                )
              }
            >
              <Image
                src="https://res.cloudinary.com/dlwcvgox7/image/upload/v1771352145/posts/hjrudbleo4u5omzm3ami.png"
                alt="KirayNow Logo"
                width={120}
                height={32}
                className="object-contain h-8 w-auto"
              />
            </Link>

            <button
              onClick={() =>
                setOpen(
                  false
                )
              }
            >
              <X
                size={24}
              />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <form
              onSubmit={
                handleSearch
              }
              className="relative"
            >
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search..."
                value={
                  searchQuery
                }
                onChange={(
                  e
                ) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
              />
            </form>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {NAV_ITEMS.map(
              (
                item
              ) => (
                <Link
                  key={
                    item.slug
                  }
                  href={buildHref(
                    item.slug
                  )}
                  onClick={() =>
                    setOpen(
                      false
                    )
                  }
                  className={`block px-4 py-3 rounded-lg ${
                    isActive(
                      item.slug
                    )
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {
                    item.name
                  }
                </Link>
              )
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t space-y-3">
            <a
              href="tel:7672876321"
              className="flex items-center justify-center gap-2 w-full bg-blue-800 text-white py-3 rounded-xl"
            >
              <Phone
                size={18}
              />
              Call Us
            </a>

            <div className="text-center text-sm text-gray-500">
              © 2026
              KirayNow.
              All rights
              reserved.
            </div>
          </div>
        </div>
      )}
    </header>
  );
}