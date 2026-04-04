"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShieldCheck, MapPin, Star } from "lucide-react";

export default function ProviderCards({
  data = [],
  citySlug,
  productName = "this product",
}) {
  const [showAll, setShowAll] = useState(false);

  if (!data || data.length === 0) return null;

  // ✅ SHOW FIRST 2 OR ALL
  const visibleVendors = showAll ? data : data.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto py-6">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900">
          Compare Rental Prices from Verified Vendors in {citySlug}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Get instant quotes, check availability and contact vendors directly
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleVendors.map((vendor) => {
          const phone = vendor?.contact?.phone || vendor?.phone || "";

          const whatsapp =
            vendor?.contact?.whatsapp || vendor?.whatsappNumber || phone;

          const rating = vendor?.stats?.ratingAvg || 0;
          const ratingCount = vendor?.stats?.ratingCount || 0;

          const price =
            vendor?.product?.discountedPrice || vendor?.product?.price || null;

          const whatsappMessage = `
Hi KirayNow Team 👋

I Want to get Quotation with ${vendor.name} 

Product: ${productName}
City: ${citySlug}

Please share availability and best price.
`;

          const whatsappLink = whatsapp
            ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
                whatsappMessage,
              )}`
            : null;

          return (
            <Link
              key={vendor._id}
              href={`/${citySlug}/vendors/${vendor.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition block"
            >
              {/* TOP FLEX */}
              <div className="flex gap-4">
                {vendor?.logo && (
                  <Image
                    src={vendor.logo}
                    alt={vendor.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                )}

                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                    {vendor.name}
                  </h3>

                  {rating > 0 && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Star size={14} className="text-yellow-500" />
                      {rating} ({ratingCount})
                    </div>
                  )}

                  {(vendor?.badges?.verified || vendor?.isVerified) && (
                    <div className="flex items-center gap-1 mt-1 text-green-600 text-xs font-medium">
                      <ShieldCheck size={14} />
                      Verified Vendor
                    </div>
                  )}

                  {vendor?.location?.city && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin size={14} />
                      {vendor.location.street} {vendor.location.city}
                    </div>
                  )}
                </div>
              </div>

              {/* PRICE */}
              {price && (
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="text-lg font-semibold text-black">₹{price}</p>
                  </div>

                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                    Best Price
                  </span>
                </div>
              )}

              {/* BUTTON */}
              <div
                className="flex gap-2 mt-4"
                onClick={(e) => e.stopPropagation()}
              >
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

      {/* ✅ VIEW MORE BUTTON */}
      {data.length > 2 && (
        <div className="flex justify-center mt-5 ">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center cursor-pointer gap-2 text-sm font-medium text-blue-700 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full transition-all"
          >
            {showAll ? "Show Less" : "View More Vendors"}
            <span className="text-lg leading-none">{showAll ? "↑" : "↓"}</span>
          </button>
        </div>
      )}
    </section>
  );
}
