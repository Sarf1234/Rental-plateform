import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function VendorHero({ vendor }) {

  const format = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const location = [
    format(vendor?.address?.street),
    format(vendor?.address?.city)
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="relative h-[320px] w-full">

      <Image
        src={vendor.coverImage || vendor.logo}
        alt={vendor.name}
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 pb-8 flex items-center gap-5">

        <Image
          src={vendor.logo || vendor.coverImage}
          alt={vendor.name}
          width={90}
          height={90}
          className="rounded-xl border-2 border-white bg-white p-1 shadow"
        />

        <div className="text-white">

          <h1 className="text-lg md:text-3xl font-semibold flex items-center gap-2">
  {vendor.name}

  {vendor.isVerified && (
    <CheckCircle
      size={20}
      className="text-green-500"
    />
  )}
</h1>

          {/* LOCATION */}
          {location && (
            <p className="text-sm text-gray-200 mt-1 flex items-center gap-1">
              {location} {vendor.ratingAvg > 0 && (
              <span>
                ⭐ {vendor.ratingAvg} ({vendor.ratingCount})
              </span>
            )}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-2 text-sm">

            {/* {vendor.isVerified && (
              <span className="bg-green-600 px-2 py-1 rounded">
                Verified Vendor
              </span>
            )} */}

            

            {vendor.experienceYears && (
              <span>
                {vendor.experienceYears}+ years experience
              </span>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}