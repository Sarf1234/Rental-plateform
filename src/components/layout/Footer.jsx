import React from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import FooterServiceCategories from "./FooterServiceCategories";
import { Suspense } from "react";
import FooterContact from "./FooterContact";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 py-10 sm:py-12 md:py-16">

        {/* Top Grid */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4

            gap-8
            sm:gap-10
            md:gap-12

            text-center
            md:text-left

            text-sm
          "
        >

          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">

            <h3
              className="
                text-xl
                sm:text-2xl
                font-bold
                leading-[1.2]
                text-gray-900
              "
            >
              Kiray<span className="text-black">Now</span>
            </h3>

            <p
              className="
                mt-3
                sm:mt-4

                text-xs
                sm:text-sm
                md:text-base

                leading-5
                md:leading-6

                text-gray-600

                max-w-xs
              "
            >
              KirayNow is a marketplace where you can Book premium event rental
              products including decor, sound systems, lighting and wedding
              setups. Fast delivery and with trusted vendors.
            </p>

            {/* Social Icons */}
            <div
              className="
                flex
                gap-3
                sm:gap-4

                mt-5
                sm:mt-6

                justify-center
                md:justify-start
              "
            >

              {/* Instagram */}
              <Link
                href="https://www.instagram.com/kiraynow?igsh=NWVjejI3bGM2ajFu"
                target="_blank"
                className="
                  p-2
                  rounded-full
                  bg-white
                  shadow-sm
                  hover:shadow-md
                  transition
                "
              >
                <Instagram size={18} />
              </Link>

              {/* Facebook */}
              <Link
                href="https://www.facebook.com/share/1LirAGRdLp/"
                target="_blank"
                className="
                  p-2
                  rounded-full
                  bg-white
                  shadow-sm
                  hover:shadow-md
                  transition
                "
              >
                <Facebook size={18} />
              </Link>

              {/* WhatsApp */}
              <Link
                href="https://wa.me/917672876321"
                target="_blank"
                className="
                  p-2
                  rounded-full
                  shadow-sm
                  hover:shadow-md
                  transition
                "
              >
                <MessageCircle size={18} />
              </Link>

            </div>
          </div>

          {/* Categories */}
          <div>
            <h4
              className="
                font-semibold
                text-gray-900

                mb-3
                sm:mb-4

                uppercase
                tracking-wide

                text-xs
                sm:text-sm
              "
            >
              Rental Categories
            </h4>

            <Suspense fallback={null}>
              <FooterServiceCategories />
            </Suspense>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="
                font-semibold
                text-gray-900

                mb-3
                sm:mb-4

                uppercase
                tracking-wide

                text-xs
                sm:text-sm
              "
            >
              Quick Links
            </h4>

            <ul
              className="
                space-y-2
                text-xs
                sm:text-sm
                md:text-base
                text-gray-600
              "
            >
              <li>
                <Link
                  href="/about"
                  className="hover:text-black transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/faq"
                  className="hover:text-black transition"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal + Contact */}
          <div className="flex flex-col items-center md:items-start">

            <h4
              className="
                font-semibold
                text-gray-900

                mb-3
                sm:mb-4

                uppercase
                tracking-wide

                text-xs
                sm:text-sm
              "
            >
              Legal & Support
            </h4>

            <ul
              className="
                space-y-2

                text-xs
                sm:text-sm
                md:text-base

                text-gray-600

                mb-5
                sm:mb-6
              "
            >
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-black transition"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-black transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>

            {/* Contact Info */}
            <FooterContact />
          </div>
        </div>

        {/* Divider */}
        <div
          className="
            mt-10
            sm:mt-12
            md:mt-14

            border-t
            border-gray-200

            pt-5
            sm:pt-6

            text-center

            text-[10px]
            sm:text-xs
            md:text-sm

            leading-5

            text-gray-500
          "
        >
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-gray-700">
            KirayNow
          </span>
          . All rights reserved.
        </div>

      </div>
    </footer>
  );
}