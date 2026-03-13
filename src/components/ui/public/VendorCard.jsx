import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

export default function VendorCard({ vendor, citySlug }) {
  if (!vendor) return null;

  const image =
    vendor.logo ||
    vendor.coverImage 

  const location = [
    vendor?.address?.street,
    vendor?.address?.city
  ]
    .filter(Boolean)
    .join(", ");

  const vendorUrl = `/${citySlug}/vendors/${vendor.slug}`;

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300">

      {/* IMAGE */}
      <Link href={vendorUrl}>
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={vendor.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4 space-y-2">

        <Link href={vendorUrl}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
            {vendor.name}
          </h3>
        </Link>

        {/* LOCATION */}
        {location && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={14} />
            {location}
          </p>
        )}

        {/* RATING */}
        {vendor.ratingAvg > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <Star size={14} className="text-yellow-500" />
            <span>{vendor.ratingAvg}</span>
            <span className="text-gray-400 text-xs">
              ({vendor.ratingCount})
            </span>
          </div>
        )}

        {/* CTA */}
        <Link
          href={vendorUrl}
          className="inline-flex items-center justify-center mt-2 px-3 py-2 text-sm font-medium rounded-lg border border-black text-black hover:bg-black hover:text-white transition"
        >
          View Vendor →
        </Link>
      </div>
    </div>
  );
}