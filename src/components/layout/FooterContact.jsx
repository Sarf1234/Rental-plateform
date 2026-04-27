"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useCity } from "@/context/CityContext";

export default function FooterContact() {
  const { city, ready } = useCity();
  const footer = city?.footer || {};

  const email =
    footer.email || "kiraynow@gmail.com";

  const phone =
    footer.phone || "7672876321";

  const address =
    footer.address ||
    "Mumbai, Maharashtra, India";

  return (
    <div className="space-y-3 text-gray-600 text-center md:text-left">
      {/* Email */}
      <div className="flex items-center justify-center md:justify-start gap-2">
        <Mail size={16} />
        <a
          href={`mailto:${email}`}
          className="hover:text-black transition"
        >
          {email}
        </a>
      </div>

      {/* Phone */}
      <div className="flex items-center justify-center md:justify-start gap-2">
        <Phone size={16} />
        <a
          href={`tel:+91${phone}`}
          className="hover:text-black transition"
        >
          +91 {phone}
        </a>
      </div>

      {/* Address */}
      <div className="flex items-start justify-center md:justify-start gap-2">
        <MapPin
          size={16}
          className="mt-0.5 shrink-0"
        />
        <span>{address}</span>
      </div>
    </div>
  );
}