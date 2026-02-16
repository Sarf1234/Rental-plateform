import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export default function ServiceCard({ service = {}, citySlug }) {
  /* ---------- SAFE DEFAULT DATA ---------- */
  const {
    title = "Premium Wedding Decoration",
    slug = "premium-wedding-decoration",
    images = ["https://res.cloudinary.com/dlwcvgox7/image/upload/v1770009777/posts/xd3ftryqa4qrrqojqlva.webp"],
    serviceType = "on_site",
    pricing = {
      type: "starting_from",
      amount: 9999,
      label: "",
    },
    features = ["Professional Team", "High Quality Setup"],
    isFeatured = false,
    isTopService = false,
    isBestService = false,
    contactMode = "call_whatsapp",
    whatsappNumber = "919999999999",
    callNumber = "9999999999",
  } = service || {};

  const imageUrl = images?.[0] || "/placeholder.jpg";

  /* ---------- PRICE LOGIC ---------- */
  const getPriceLabel = () => {
    if (!pricing) return "Get Quote";

    if (pricing.label) return pricing.label;

    if (pricing.type === "fixed" && pricing.amount) {
      return `₹${pricing.amount}`;
    }

    if (pricing.type === "starting_from" && pricing.amount) {
      return `Starting ₹${pricing.amount}`;
    }

    return "Get Quote";
  };

  /* ---------- SERVICE TYPE LABEL ---------- */
  const serviceTypeLabel =
    serviceType === "on_site"
      ? "On Site"
      : serviceType === "remote"
      ? "Remote"
      : "Hybrid";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">

      {/* Promotion Badges */}
      {/* <div className="absolute top-3 left-3 flex gap-2 z-10">
        {isFeatured && (
          <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-md">
            Featured
          </span>
        )}
        {isTopService && (
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md">
            Top
          </span>
        )}
        {isBestService && (
          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-md">
            Best
          </span>
        )}
      </div> */}

      {/* Service Type Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="text-xs bg-black/80 text-white px-2 py-1 rounded-md backdrop-blur">
          {serviceTypeLabel}
        </span>
      </div>

      {/* Image */}
      <Link
        href={`/${citySlug}/${slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
        />
      </Link>

      {/* Content */}
      <div className="p-5 space-y-3">

        {/* Title */}
        <Link href={`/${citySlug}/${slug}`}>
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-blue-600 transition">
            {title}
          </h3>
        </Link>

        {/* Features */}
        {features.length > 0 && (
          <ul className="text-xs text-gray-500 space-y-1">
            {features.slice(0, 2).map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        )}

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-3">

          {/* Price */}
          <div className="text-lg font-semibold text-gray-900">
            {getPriceLabel()}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2">
            {(contactMode === "call" || contactMode === "call_whatsapp") &&
              callNumber && (
                <a
                  href={`tel:${callNumber}`}
                  className="p-2 rounded-lg border hover:bg-gray-100 transition"
                >
                  <Phone size={16} />
                </a>
              )}

            {(contactMode === "whatsapp" ||
              contactMode === "call_whatsapp") &&
              whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  className="p-2 rounded-lg border hover:bg-green-50 transition"
                >
                  <MessageCircle size={16} />
                </a>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
