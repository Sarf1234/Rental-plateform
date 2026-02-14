import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Phone, Mail } from "lucide-react";
import FooterServiceCategories from "./FooterServiceCategories";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 ">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm text-center md:text-left">

          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-bold text-gray-900">
              Kiray<span className="text-black">Now</span>
            </h3>

            <p className="mt-4 text-gray-600 leading-relaxed max-w-xs">
              Book premium event rental products including decor, sound systems,
              lighting and wedding setups. Fast delivery and trusted vendors.
            </p>

            {/* Social Icons */}
            {/* <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <Link href="#" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition">
                <Linkedin size={18} />
              </Link>
            </div> */}
          </div>

          {/* Categories */}
          <div>
              <h4 className="font-semibold text-gray-900 mb-4 uppercase tracking-wide text-sm">
                Rental Categories
              </h4>

              <FooterServiceCategories />
            </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 uppercase tracking-wide text-sm">
              Quick Links
            </h4>

            <ul className="space-y-2 text-gray-600">
              {/* <li><Link href="/contact" className="hover:text-black transition">Contact Us</Link></li> */}
              <li><Link href="/about" className="hover:text-black transition">About Us</Link></li>
              {/* <li><Link href="/city" className="hover:text-black transition">Browse Cities</Link></li> */}
              <li><Link href="/faq" className="hover:text-black transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Legal + Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-gray-900 mb-4 uppercase tracking-wide text-sm">
              Legal & Support
            </h4>

            <ul className="space-y-2 text-gray-600 mb-6">
              <li><Link href="/terms-and-conditions" className="hover:text-black transition">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-black transition">Privacy Policy</Link></li>
              {/* <li><Link href="/refund-policy" className="hover:text-black transition">Refund Policy</Link></li> */}
            </ul>

            {/* Contact Info */}
            <div className="space-y-3 text-gray-600 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} />
                <span>support@kiraynow.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone size={16} />
                <span>+91 8839931558</span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-14 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-gray-700">
            RentPlatform
          </span>. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
