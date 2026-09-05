import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export default function ServiceCard({
  service = {},
  citySlug,
}) {
  /* ---------- SAFE DEFAULT DATA ---------- */

  const {
    title = "Premium Wedding Decoration",
    slug = "premium-wedding-decoration",
    images = [
      "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770009777/posts/xd3ftryqa4qrrqojqlva.webp",
    ],
    serviceType = "on_site",
    pricing = {
      type: "starting_from",
      amount: 9999,
      label: "",
    },
    features = [
      "Professional Team",
      "High Quality Setup",
    ],
    isFeatured = false,
    isTopService = false,
    isBestService = false,
    contactMode = "call_whatsapp",
    whatsappNumber = "919999999999",
    callNumber = "9999999999",
  } = service || {};

  const imageUrl =
    images?.[0] || "/placeholder.jpg";

  /* ---------- PRICE LOGIC ---------- */

  const getPriceLabel = () => {
    if (!pricing) return "Get Quote";

    if (pricing.label) {
      return pricing.label;
    }

    if (
      pricing.type === "fixed" &&
      pricing.amount
    ) {
      return `₹${pricing.amount}`;
    }

    if (
      pricing.type === "starting_from" &&
      pricing.amount
    ) {
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

  const serviceUrl = `/${citySlug}/${slug}`;

  return (
    <div
      className="
        group
        h-full
        relative
        overflow-hidden

        rounded-2xl

        border
        border-gray-100

        bg-white

        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1

        transition-all
        duration-300
      "
    >
      {/* -------------------------------- */}
      {/* SERVICE TYPE BADGE */}
      {/* -------------------------------- */}

      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
        <span
          className="
            bg-black/80
            text-white
            backdrop-blur

            rounded-md

            px-1.5
            sm:px-2

            py-1

            text-[10px]
            sm:text-[11px]
            md:text-xs

            font-medium
            leading-none

            whitespace-nowrap
          "
        >
          {serviceTypeLabel}
        </span>
      </div>

      {/* -------------------------------- */}
      {/* IMAGE */}
      {/* -------------------------------- */}

      <Link
        href={serviceUrl}
        className="
          relative
          block
          aspect-[4/3]
          overflow-hidden
        "
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="
            object-cover
            group-hover:scale-105
            transition
            duration-500
          "
          sizes="
            (max-width:640px) 100vw,
            (max-width:1024px) 50vw,
            25vw
          "
        />
      </Link>

      {/* -------------------------------- */}
      {/* CONTENT */}
      {/* -------------------------------- */}

      <div
        className="
          p-3
          sm:p-4
          md:p-5

          space-y-2
          sm:space-y-3
          md:space-y-4
        "
      >
        {/* TITLE */}

        <Link href={serviceUrl}>
          <h3
            className="
              font-semibold
              text-gray-900

              line-clamp-2

              text-[13px]
              sm:text-sm
              md:text-base

              leading-[1.3]

              group-hover:text-blue-600
              transition
            "
          >
            {title}
          </h3>
        </Link>

        {/* FEATURES */}

        {features.length > 0 && (
          <ul
            className="
              text-[10px]
              sm:text-[11px]
              md:text-xs

              leading-5

              text-gray-500

              space-y-0.5
              sm:space-y-1
            "
          >
            {features
              .slice(0, 2)
              .map((feature, index) => (
                <li key={index}>
                  • {feature}
                </li>
              ))}
          </ul>
        )}

        {/* -------------------------------- */}
        {/* BOTTOM SECTION */}
        {/* -------------------------------- */}

        <div
          className="
            flex
            items-end
            justify-between

            gap-2

            pt-1
            sm:pt-2
            md:pt-3
          "
        >
          {/* PRICE */}

          <div className="min-w-0">
            <p
              className="
                text-[10px]
                sm:text-[11px]
                md:text-xs

                text-gray-500
              "
            >
              Starting From
            </p>

            <p
              className="
                font-bold
                leading-none
                text-black

                text-xs
                sm:text-xl
                md:text-2xl
              "
            >
              {getPriceLabel()}
            </p>
          </div>

          {/* CTA */}

          <Link
            href={serviceUrl}
            className="
              inline-flex
              flex-shrink-0

              items-center
              justify-center

              px-2.5
              sm:px-3
              md:px-4

              py-1.5
              sm:py-2

              text-[10px]
              sm:text-xs
              md:text-sm

              font-medium

              rounded-lg

              border
              border-black

              text-black

              whitespace-nowrap

              hover:bg-black
              hover:text-white

              transition
            "
          >
            View Service →
          </Link>
        </div>
      </div>
    </div>
  );
}