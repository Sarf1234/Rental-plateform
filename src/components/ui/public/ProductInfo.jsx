import { Phone, MessageCircle, ShieldCheck } from "lucide-react";

export default function ProductInfo({
  title,
  pricing,
  highlights,
  productdescription,
  citySlug,
  productSlug,
  locationContext,
  productRating,
  productReviewCount,
  isMainHeading,
  mobileSticky = false,
}) {
  /* ================= PRICE ================= */

  const price =
    pricing?.discountedPrice ||
    pricing?.minPrice ||
    0;

  /* ================= HEADING ================= */

  const HeadingTag = isMainHeading ? "h1" : "h2";

  /* ================= CITY CONTACT ================= */

  const cityPhone =
    locationContext?.contact?.phone || "";

  const cityWhatsApp =
    locationContext?.contact?.whatsapp ||
    cityPhone;

  const cleanPhoneNumber = (number) => {
    if (!number) return "";

    return String(number).replace(/\D/g, "");
  };

  const phoneNumber =
    cleanPhoneNumber(cityPhone);

  const whatsappNumber =
    cleanPhoneNumber(cityWhatsApp);

  /* ================= WHATSAPP MESSAGE ================= */

  const whatsappMessage = `
Hi KirayNow 👋

Interested in:
📦 ${title} | 📍 ${citySlug}

📅 Event Date:
🔢 Quantity:
📍 Delivery Location:

Please share availability & best price.

Thanks!
`;

  /* =====================================================
     MOBILE STICKY BOOKING BAR
  ===================================================== */

  if (mobileSticky) {
    return (
      <div
        className="
          fixed
          inset-x-0
          bottom-0
          z-50
          bg-white
          border-t
          border-gray-200
          shadow-[0_-6px_20px_rgba(0,0,0,0.10)]
          px-3
          pt-3
          pb-[calc(0.7rem+env(safe-area-inset-bottom))]
        "
      >
        <div className="max-w-xl mx-auto">

          {/* ================= PRICE + TRUST ================= */}

          <div className="flex items-center justify-between mb-2.5">

            {/* PRICE */}

            <div className="min-w-0">

              <p className="text-[11px] font-medium text-gray-500 leading-none mb-1">
                Starting from
              </p>

              <div className="flex items-baseline gap-1">

                <span className="text-xl font-bold text-gray-900 leading-none">
                  ₹{price}
                </span>

                {pricing?.unit && (
                  <span className="text-xs text-gray-500">
                    / {pricing.unit}
                  </span>
                )}

              </div>

            </div>

            {/* TRUST */}

            <div className="flex items-center gap-1 text-[11px] text-green-700">
              <ShieldCheck
                size={15}
                strokeWidth={2}
              />

              <span>
                Verified providers
              </span>
            </div>

          </div>

          {/* ================= ACTION BUTTONS ================= */}

          <div className="grid grid-cols-2 gap-2">

            {/* CALL */}

            {phoneNumber && (
              <a
                href={`tel:${phoneNumber}`}
                aria-label="Call KirayNow"
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  min-h-[46px]
                  rounded-xl
                  border
                  border-gray-900
                  bg-white
                  text-gray-900
                  text-sm
                  font-semibold
                  active:scale-[0.98]
                  transition-transform
                "
              >
                <Phone size={18} />

                <span>
                  Call
                </span>
              </a>
            )}

            {/* WHATSAPP */}

            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book on WhatsApp"
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  min-h-[46px]
                  rounded-xl
                  bg-green-500
                  text-white
                  text-sm
                  font-semibold
                  active:scale-[0.98]
                  transition-transform
                "
              >
                <MessageCircle size={18} />

                <span>
                  WhatsApp
                </span>
              </a>
            )}

          </div>

        </div>
      </div>
    );
  }

  /* =====================================================
     DESKTOP PRODUCT INFO
  ===================================================== */

  return (
    <div className="md:space-y-8 space-y-2">

      {/* ================= TITLE ================= */}

      <div>

        <HeadingTag className="text-3xl font-bold text-gray-900 leading-snug">

          {title} in{" "}
          {citySlug
            ? citySlug.charAt(0).toUpperCase() +
              citySlug.slice(1)
            : ""}

          {/* ================= RATING ================= */}

          {productRating > 0 && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">

              <span className="text-yellow-500 font-semibold">
                ⭐ {productRating}
              </span>

              <span>
                ({productReviewCount} reviews)
              </span>

            </div>
          )}

        </HeadingTag>

        {/* ================= BADGES ================= */}

        <div className="flex flex-wrap gap-2 mt-4">

          {highlights?.isFeatured && (
            <Badge text="Featured" />
          )}

          {highlights?.isTopRented && (
            <Badge
              text="Top Rented"
              color="bg-yellow-500"
            />
          )}

          {highlights?.isBestDeal && (
            <Badge
              text="Best Deal"
              color="bg-green-600"
            />
          )}

        </div>

      </div>

      {/* =====================================================
          DESKTOP PRICING CARD
      ===================================================== */}

      <div className="p-6 border rounded-2xl bg-white shadow-sm space-y-4">

        {/* ================= PRICE ================= */}

        <div>

          <p className="text-sm text-gray-500">
            Starting From
          </p>

          <div className="flex items-end gap-3">

            <p className="text-3xl font-bold text-black">
              ₹{price}
            </p>

            {pricing?.discountedPrice &&
              pricing?.minPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{pricing.minPrice}
                </span>
              )}

          </div>

          <p className="text-sm text-gray-500">
            per {pricing?.unit}
          </p>

        </div>

        {/* ================= BOOKING ACTIONS ================= */}

        <div className="border-t pt-6 space-y-4">

          {/* CALL */}

          {phoneNumber && (
            <a
              href={`tel:${phoneNumber}`}
              className="
                flex
                items-center
                justify-center
                gap-2
                w-full
                bg-black
                text-white
                py-3
                rounded-xl
                font-medium
                hover:scale-[1.02]
                transition-transform
                duration-200
                shadow-md
              "
            >
              <Phone size={18} />

              Call to Book Now
            </a>
          )}

          {/* WHATSAPP */}

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                justify-center
                gap-2
                w-full
                bg-green-500
                text-white
                py-3
                rounded-xl
                font-medium
                hover:bg-green-600
                transition-colors
                duration-200
                shadow-md
              "
            >
              <MessageCircle size={18} />

              Book on WhatsApp
            </a>
          )}

          {/* ================= EXPRESS ================= */}

          {locationContext?.expressAvailable && (
            <p className="text-xs text-green-600 text-center mt-2">
              Express delivery available in{" "}
              {citySlug}
            </p>
          )}

          {/* ================= HIGH DEMAND ================= */}

          {locationContext?.demandLevel === "high" && (
            <p className="text-xs text-orange-600 text-center">
              High demand in {citySlug}. Book early.
            </p>
          )}

          {/* ================= TRUST ================= */}

          <div className="bg-gray-50 border rounded-xl p-4 text-center mt-4 flex flex-col items-center gap-2">

            <ShieldCheck
              className="text-green-600"
              size={22}
            />

            <p className="text-xs text-gray-500">
              Instant confirmation • No hidden charges
            </p>

            <p className="text-sm font-semibold text-gray-900">
              Verified rental providers in{" "}
              {citySlug}
            </p>

          </div>

        </div>
      </div>

    </div>
  );
}

/* =====================================================
   BADGE
===================================================== */

function Badge({
  text,
  color = "bg-black",
}) {
  return (
    <span
      className={`${color} text-white text-xs px-3 py-1 rounded-full`}
    >
      {text}
    </span>
  );
}