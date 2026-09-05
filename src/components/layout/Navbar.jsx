
"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  Menu,
  X,
  Search,
  Phone,
  ChevronRight,
} from "lucide-react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

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

const VALID_CITIES = [
  "mumbai",
  "delhi",
  "bangalore",
  "patna",
];

const LOGO =
  "https://res.cloudinary.com/dlwcvgox7/image/upload/v1771352145/posts/hjrudbleo4u5omzm3ami.png";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { city, ready } = useCity();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);

  const mobileSearchRef = useRef(null);

  const queryCity = searchParams.get("city");

  /* =========================
     HYDRATION
  ========================= */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =========================
     SCROLL
  ========================= */

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* =========================
     CITY
  ========================= */

  const pathnameSafe = pathname || "";

  const segments = pathnameSafe
    .split("/")
    .filter(Boolean);

  const firstSegment = segments[0];

  const urlCity = VALID_CITIES.includes(firstSegment)
    ? firstSegment
    : null;

  const citySlug = mounted
    ? urlCity || city?.slug || queryCity || null
    : null;

  /* =========================
     BUILD LINKS
  ========================= */

  function buildHref(slug) {
    if (!mounted || !ready) {
      return "/";
    }

    if (slug === "/") {
      return citySlug ? `/${citySlug}` : "/";
    }

    if (slug === "/products") {
      return citySlug
        ? `/${citySlug}/products`
        : "/products";
    }

    return slug;
  }

  /* =========================
     ACTIVE STATE
  ========================= */

  function isActive(slug) {
    if (!mounted || !ready) {
      return false;
    }

    if (slug === "/") {
      return citySlug
        ? pathname === `/${citySlug}`
        : pathname === "/";
    }

    if (slug === "/products") {
      return citySlug
        ? pathname === `/${citySlug}/products`
        : pathname === "/products";
    }

    return pathname === slug;
  }

  /* =========================
     SEARCH
  ========================= */

  function handleSearch(e) {
    e.preventDefault();

    const value = searchQuery.trim();

    if (!value) return;

    const params = new URLSearchParams();

    params.set("q", value);

    if (citySlug) {
      params.set("city", citySlug);
    }

    router.push(`/search?${params.toString()}`);

    setSearchQuery("");
    setMobileSearchOpen(false);
    setOpen(false);
  }

  /* =========================
     OPEN MOBILE SEARCH
  ========================= */

  function openMobileSearch() {
    setOpen(false);
    setMobileSearchOpen(true);
  }

  /* =========================
     CLOSE MOBILE SEARCH
  ========================= */

  function closeMobileSearch() {
    setMobileSearchOpen(false);
  }

  /* =========================
     MOBILE SEARCH FOCUS
  ========================= */

  useEffect(() => {
    if (!mobileSearchOpen) return;

    const timer = setTimeout(() => {
      mobileSearchRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [mobileSearchOpen]);

  /* =========================
     BODY LOCK
  ========================= */

  useEffect(() => {
    const shouldLock =
      open || mobileSearchOpen;

    if (shouldLock) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mobileSearchOpen]);

  /* =========================
     ESC KEY
  ========================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (mobileSearchOpen) {
        closeMobileSearch();
        return;
      }

      if (open) {
        setOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [mobileSearchOpen, open]);

  /* =========================
     CLOSE ON NAVIGATION
  ========================= */

  useEffect(() => {
    setOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ========================================
          MAIN NAVBAR
      ======================================== */}

      <header
        className={`
          fixed
          top-0
          left-0
          right-0
          z-50
          w-full

          bg-white

          border-b

          transition-all
          duration-300

          ${
            scrolled
              ? `
                border-gray-200
                shadow-[0_4px_20px_rgba(15,23,42,0.07)]
              `
              : `
                border-gray-100
              `
          }
        `}
      >
        <div
          className="
            max-w-7xl
            mx-auto
            w-full

            h-[60px]
            sm:h-[64px]
            md:h-[68px]

            px-3
            sm:px-4

            flex
            items-center

            gap-2
            sm:gap-3
          "
        >
          {/* ====================================
              LOGO
          ==================================== */}

          <Link
            href={buildHref("/")}
            aria-label="KirayNow Home"
            className="
              flex
              flex-shrink-0
              items-center
            "
          >
            <Image
              src={LOGO}
              alt="KirayNow"
              width={120}
              height={32}
              priority
              className="
                h-7
                sm:h-8
                w-auto
                object-contain
              "
            />
          </Link>

          {/* ====================================
              DESKTOP SEARCH
          ==================================== */}

          <div
            className="
              hidden
              md:flex

              flex-1

              max-w-2xl

              mx-2
              lg:mx-4
            "
          >
            <form
              onSubmit={handleSearch}
              className="
                relative
                w-full
              "
            >
              <Search
                size={18}
                className="
                  pointer-events-none

                  absolute
                  left-3.5
                  top-1/2

                  -translate-y-1/2

                  text-gray-400
                "
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search chairs, tables, decor, sound..."
                className="
                  h-11
                  w-full

                  rounded-xl

                  border
                  border-gray-200

                  bg-gray-50

                  pl-11
                  pr-24

                  text-sm
                  text-gray-900

                  placeholder:text-gray-400

                  outline-none

                  transition

                  focus:border-[#003459]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#003459]/10
                "
              />

              <button
                type="submit"
                className="
                  absolute
                  right-1.5
                  top-1/2

                  -translate-y-1/2

                  h-8

                  rounded-lg

                  bg-[#003459]

                  px-3

                  text-xs
                  font-semibold

                  text-white

                  transition

                  hover:bg-[#002b4a]
                  active:scale-95
                "
              >
                Search
              </button>
            </form>
          </div>

          {/* ====================================
              DESKTOP CONTROLS
          ==================================== */}

          <div
            className="
              hidden
              md:flex

              items-center
              gap-2
              lg:gap-3

              ml-auto
            "
          >
            {/* CITY */}

            <div
              className="
                flex
                flex-shrink-0
                items-center

                rounded-xl

                border
                border-gray-200

                bg-white

                hover:border-gray-300

                transition
              "
            >
              <CitySelect />
            </div>

            {/* NAV */}

            <nav
              aria-label="Main navigation"
              className="
                hidden
                lg:flex

                items-center
                gap-0.5
              "
            >
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.slug);

                return (
                  <Link
                    key={item.slug}
                    href={buildHref(item.slug)}
                    className={`
                      relative

                      flex
                      items-center

                      rounded-lg

                      px-3
                      py-2

                      text-sm

                      transition-all
                      duration-200

                      ${
                        active
                          ? `
                            bg-[#eef6fa]
                            text-[#003459]
                            font-semibold
                          `
                          : `
                            text-gray-600
                            hover:bg-gray-50
                            hover:text-[#003459]
                          `
                      }
                    `}
                  >
                    {item.name}

                    {active && (
                      <span
                        className="
                          absolute
                          bottom-0.5
                          left-1/2

                          h-0.5
                          w-4

                          -translate-x-1/2

                          rounded-full

                          bg-[#003459]
                        "
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CALL CTA */}

            <a
              href="tel:7672876321"
              className="
                hidden
                xl:flex

                h-10

                items-center
                gap-2

                rounded-xl

                bg-[#003459]

                px-3.5

                text-sm
                font-semibold

                text-white

                transition-all

                hover:bg-[#002b4a]
                hover:shadow-md

                active:scale-[0.98]
              "
            >
              <Phone size={16} />
              Call Us
            </a>
          </div>

          {/* ====================================
              MOBILE ACTIONS
          ==================================== */}

          <div
            className="
              ml-auto

              flex
              items-center
              gap-1

              md:hidden
            "
          >
            {/* LOCATION */}

            <div
              className="
                max-w-[110px]

                overflow-hidden

                rounded-lg

                border
                border-gray-200

                bg-white
              "
            >
              <CitySelect />
            </div>

            {/* SEARCH */}

            <button
              type="button"
              aria-label="Search rental products"
              onClick={openMobileSearch}
              className="
                flex
                h-9
                w-9

                flex-shrink-0

                items-center
                justify-center

                rounded-lg

                text-gray-700

                hover:bg-gray-100

                active:scale-95

                transition
              "
            >
              <Search size={20} />
            </button>

            {/* HAMBURGER */}

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => {
                setMobileSearchOpen(false);
                setOpen(true);
              }}
              className="
                flex
                h-9
                w-9

                flex-shrink-0

                items-center
                justify-center

                rounded-lg

                text-gray-700

                hover:bg-gray-100

                active:scale-95

                transition
              "
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================
          FULL-SCREEN MOBILE SEARCH
      ======================================== */}

      {mobileSearchOpen && (
        <div
          className="
            fixed
            inset-0

            z-[90]

            bg-white

            md:hidden

            flex
            flex-col
          "
        >
          {/* SEARCH HEADER */}

          <div
            className="
              flex
              items-center
              gap-2

              min-h-[60px]

              px-3

              border-b
              border-gray-200
            "
          >
            
            <form
              onSubmit={handleSearch}
              className="
                relative
                flex-1
              "
            >
              <Search
                size={17}
                className="
                  pointer-events-none

                  absolute
                  left-3
                  top-1/2

                  -translate-y-1/2

                  text-gray-400
                "
              />

              <input
                ref={mobileSearchRef}
                type="search"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search rental products..."
                className="
                  h-10
                  w-full

                  rounded-xl

                  border
                  border-gray-200

                  bg-gray-50

                  pl-10
                  pr-3

                  text-[13px]

                  text-gray-900

                  placeholder:text-gray-400

                  outline-none

                  focus:border-[#003459]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#003459]/10
                "
              />
            </form>
            <button
              type="button"
              aria-label="Close search"
              onClick={closeMobileSearch}
              className="
                flex
                h-9
                w-9

                flex-shrink-0

                items-center
                justify-center

                rounded-lg

                text-gray-600

                hover:bg-gray-100

                active:scale-95

                transition
              "
            >
              <X size={20} />
            </button>

          </div>

          {/* SEARCH CONTENT */}

          <div
            className="
              flex-1
              overflow-y-auto

              px-4
              py-6
            "
          >
            <p
              className="
                text-sm
                font-semibold

                text-gray-900
              "
            >
              What are you looking for?
            </p>

            <div
              className="
                mt-4

                grid
                grid-cols-2

                gap-2.5
              "
            >
              {[
                "Chairs",
                "Tables",
                "Sofas",
                "Decor",
                "Lighting",
                "Sound",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setSearchQuery(item);
                    requestAnimationFrame(() => {
                      mobileSearchRef.current?.focus();
                    });
                  }}
                  className="
                    rounded-xl

                    border
                    border-gray-200

                    bg-gray-50

                    px-4
                    py-3

                    text-left

                    text-sm
                    font-medium

                    text-gray-700

                    hover:border-[#003459]
                    hover:bg-[#f8fbfd]
                    hover:text-[#003459]

                    transition
                  "
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          MOBILE MENU
      ======================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0

            z-[100]

            lg:hidden
          "
        >
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="
              absolute
              inset-0

              bg-black/30
            "
          />

          {/* DRAWER */}

          <aside
            className="
              absolute
              inset-y-0
              right-0

              w-[88%]
              max-w-sm

              bg-white

              shadow-2xl

              flex
              flex-col
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                h-[64px]

                items-center
                justify-between

                px-4

                border-b
                border-gray-100
              "
            >
              <Link
                href={buildHref("/")}
                onClick={() => setOpen(false)}
              >
                <Image
                  src={LOGO}
                  alt="KirayNow"
                  width={120}
                  height={32}
                  className="
                    h-8
                    w-auto
                    object-contain
                  "
                />
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="
                  flex
                  h-9
                  w-9

                  items-center
                  justify-center

                  rounded-lg

                  text-gray-600

                  hover:bg-gray-100
                "
              >
                <X size={21} />
              </button>
            </div>

            {/* CITY */}

            <div
              className="
                mx-4
                mt-4

                rounded-xl

                border
                border-gray-200

                bg-gray-50

                px-3
                py-2.5
              "
            >
              <p
                className="
                  mb-1

                  text-[10px]

                  font-semibold
                  uppercase
                  tracking-wide

                  text-gray-400
                "
              >
                Your location
              </p>

              <CitySelect />
            </div>

            {/* NAVIGATION */}

            <nav
              aria-label="Mobile navigation"
              className="
                flex-1
                overflow-y-auto

                px-4
                py-5
              "
            >
              <p
                className="
                  mb-2
                  px-2

                  text-[10px]

                  font-semibold
                  uppercase
                  tracking-wider

                  text-gray-400
                "
              >
                Explore
              </p>

              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.slug);

                  return (
                    <Link
                      key={item.slug}
                      href={buildHref(item.slug)}
                      onClick={() => setOpen(false)}
                      className={`
                        flex
                        items-center
                        justify-between

                        rounded-xl

                        px-4
                        py-3.5

                        text-sm

                        transition

                        ${
                          active
                            ? `
                              bg-[#eef6fa]
                              text-[#003459]
                              font-semibold
                            `
                            : `
                              text-gray-700
                              hover:bg-gray-50
                            `
                        }
                      `}
                    >
                      <span>
                        {item.name}
                      </span>

                      <ChevronRight
                        size={17}
                        className={
                          active
                            ? "text-[#003459]"
                            : "text-gray-300"
                        }
                      />
                    </Link>
                  );
                })}
              </div>

              {/* CALL */}

              <a
                href="tel:7672876321"
                className="
                  mt-5

                  flex
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-[#003459]

                  px-4
                  py-3.5

                  text-sm
                  font-semibold

                  text-white

                  shadow-sm
                "
              >
                <Phone size={17} />
                Call KirayNow
              </a>
            </nav>

            {/* FOOTER */}

            <div
              className="
                border-t
                border-gray-100

                px-5
                py-4

                text-center

                text-[11px]

                text-gray-400
              "
            >
              © 2026 KirayNow. All rights reserved.
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

