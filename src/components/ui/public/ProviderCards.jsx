"use client";

import Link from "next/link";
import { Phone, MessageCircle, ShieldCheck } from "lucide-react";

export default function ProviderCards({ data = [], citySlug }) {
  if (!data.length) return null;

  return (
    <section className="max-w-7xl mx-auto py-14">
      <div className="px-4">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">
              Rental Providers in {citySlug}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Trusted and verified businesses offering this product
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((provider) => {
            const whatsappLink = `https://wa.me/${provider.phone}?text=${encodeURIComponent(
              `Hi, I found your business on KirayNow for rentals in ${citySlug}.`
            )}`;

            return (
              <div
                key={provider._id}
                className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#003459] to-blue-500 rounded-t-2xl" />

                {/* Name */}
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#003459] transition">
                  {provider.name}
                </h3>

                {/* Verified Badge */}
                {provider.isVerified && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-medium">
                    <ShieldCheck size={14} />
                    Verified Business
                  </div>
                )}

                {/* Phone */}
                <p className="text-sm text-gray-500 mt-3">
                  {provider.phone}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-5">
                  <a
                    href={`tel:${provider.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2 text-sm hover:bg-gray-100 transition"
                  >
                    <Phone size={16} />
                    Call
                  </a>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white rounded-lg py-2 text-sm hover:bg-green-600 transition"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}