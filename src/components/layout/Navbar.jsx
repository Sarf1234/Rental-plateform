"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, Home, Phone, BookOpen, Facebook, Instagram, MessageSquare, User, Heart } from "lucide-react";
import CitySelect from "../navbar/CitySelect";

// Updated navigation items for rental app
const NAV_ITEMS = [
  { name: "Home", slug: "/", icon: <Home size={18} /> },
  // { name: "Rentals", slug: "/rentals" },
  // { name: "List Property", slug: "/list-property" },
  // { name: "Saved", slug: "/saved", icon: <Heart size={18} /> },
  { name: "Blogs", slug: "/blogs", icon: <BookOpen size={18} /> },
  { name: "Contact Us", slug: "/contact", icon: <Phone size={18} /> },
];

const SOCIAL_LINKS = [
  { name: "Facebook", url: "https://facebook.com", icon: <Facebook size={18} />, color: "text-blue-600" },
  { name: "Instagram", url: "https://instagram.com", icon: <Instagram size={18} />, color: "text-pink-600" },
  { name: "WhatsApp", url: "https://wa.me", icon: <MessageSquare size={18} />, color: "text-green-600" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (slug) => pathname === slug;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setOpen(false); // Close mobile menu on search
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur border-b border-gray-200 shadow-lg"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Home size={22} />
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:block">
            Rent<span className="text-blue-600">Ease</span>
          </span>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          
          <form onSubmit={handleSearch} className="w-full relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search for apartments, villas, offices..."
                className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
              >
                Search
              </button> */}
            </div>
          </form>
        </div>

        {/* City Selector and Navigation */}
        <div className="flex items-center gap-4">
          <CitySelect />
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
            {NAV_ITEMS.slice(0, 4).map((item) => (
              <Link
                key={item.slug}
                href={item.slug}
                className={`px-3 py-2 rounded-md transition ${
                  isActive(item.slug)
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Social Icons (Desktop) */}
          {/* <div className="hidden lg:flex items-center gap-3 ml-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition ${social.color}`}
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div> */}

          {/* User/Login (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 ml-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <User size={18} />
              <span className="text-sm font-medium">Login</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label="Open menu"
            className="lg:hidden text-gray-700 ml-4"
            onClick={() => setOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
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

          {/* Mobile Search Bar */}
          <div className="p-4 border-b">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Mobile Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.slug}
                  href={item.slug}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive(item.slug)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon && <span className="text-gray-500">{item.icon}</span>}
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Social Links */}
            <div className="mt-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">
                Follow Us
              </h3>
              <div className="flex gap-4 px-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition ${social.color}`}
                  >
                    {social.icon}
                    <span className="text-sm font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Login Button */}
            <div className="mt-8 px-4">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                <User size={18} />
                Login / Sign Up
              </button>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="border-t p-4">
            <div className="text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} RentEase. All rights reserved.</p>
              <div className="flex justify-center gap-6 mt-2">
                <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
                <Link href="/terms" className="hover:text-blue-600">Terms</Link>
                <Link href="/help" className="hover:text-blue-600">Help</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}