"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { name: "Beginner Guide", slug: "/tag/beginner-guide" },
  { name: "Free AI Tools", slug: "/tag/free-accessible" },
  { name: "Prompts", slug: "/tag/prompts-templates" },
  { name: "Productivity", slug: "/tag/productivity-efficiency" },
  { name: "Automation", slug: "/tag/automation" },
  { name: "Real-World Use", slug: "/tag/real-world-use" },
  { name: "Blog", slug: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (slug) => pathname === slug;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* ✅ Brand / Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-slate-900">
            India<span className="text-blue-600">AI</span>Mag
          </span>
        </Link>

        {/* ✅ Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.slug}
              href={item.slug}
              className={`transition ${
                isActive(item.slug)
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* ✅ Mobile Menu Button */}
        <button
          aria-label="Open menu"
          className="md:hidden text-slate-700"
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ✅ Mobile Navigation */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-white px-6 pt-4">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-semibold text-slate-900">
              IndiaAIMag
            </span>
            <button onClick={() => setOpen(false)}>
              <X size={22} className="text-slate-600" />
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={item.slug}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive(item.slug)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
