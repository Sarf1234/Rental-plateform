"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Star,
} from "lucide-react";

export default function ProviderCards({ data = [], citySlug }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto py-14">
      <div className="px-4">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">
            Rental Providers in {citySlug}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Compare prices and contact trusted vendors
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {data.map((vendor) => {

            const phone =
              vendor?.contact?.phone || vendor?.phone || "";

            const whatsapp =
              vendor?.contact?.whatsapp ||
              vendor?.whatsappNumber ||
              phone;

            const rating = vendor?.stats?.ratingAvg || 0;
            const ratingCount = vendor?.stats?.ratingCount || 0;

            const price =
              vendor?.product?.discountedPrice ||
              vendor?.product?.price ||
              null;

            const whatsappLink = whatsapp
              ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
                  `Hi, I found your business on KirayNow for rentals in ${citySlug}.`
                )}`
              : null;

            return (
              <Link
                key={vendor._id}
                href={`/${citySlug}/vendors/${vendor.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition block"
              >

                {/* Header */}
                <div className="flex items-center gap-3">

                  {vendor?.logo && (
                    <Image
                      src={vendor.logo}
                      alt={vendor.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {vendor.name}
                    </h3>

                    {rating > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Star size={14} className="text-yellow-500" />
                        {rating} ({ratingCount})
                      </div>
                    )}

                    {(vendor?.badges?.verified || vendor?.isVerified) && (
                      <div className="flex items-center gap-1 mt-1 text-green-600 text-xs font-medium">
                        <ShieldCheck size={14} />
                        Verified
                      </div>
                    )}

                  </div>
                </div>

                {/* Location */}
                {vendor?.location?.city && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                    <MapPin size={14} />
                    {vendor?.location?.street
                      ? `${vendor.location.street}, `
                      : ""}
                    {vendor.location.city}
                  </div>
                )}

                {/* Price */}
                {price && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">
                      Starting from
                    </p>

                    <p className="text-lg font-semibold text-black">
                      ₹{price}
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div
                  className="flex gap-2 mt-5"
                  onClick={(e) => e.stopPropagation()}
                >

                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2 text-sm hover:bg-gray-100 transition"
                    >
                      <Phone size={15} />
                      Call
                    </a>
                  )}

                  {whatsappLink && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white rounded-lg py-2 text-sm hover:bg-green-600 transition"
                    >
                      <MessageCircle size={15} />
                      WhatsApp
                    </a>
                  )}

                </div>

              </Link>
            );
          })}

        </div>
      </div>
    </section>
  );
}