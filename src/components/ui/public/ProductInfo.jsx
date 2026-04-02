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
}) {
  const price = pricing?.discountedPrice || pricing?.minPrice;

  const HeadingTag = isMainHeading ? "h1" : "h2";

  const whatsappMessage = `
Hi KirayNow Team 👋

I'm interested in renting the following product:

Product: ${title}
City: ${citySlug}

Event Date:
Quantity Required:
Delivery Location:

Additional Requirements (if any):

Please share availability and quotation.

Thank you!
`;

  return (
    <div className="space-y-8">
      {/* ================= TITLE + BADGES ================= */}
      <div>
        <HeadingTag  className="text-3xl font-bold text-gray-900 leading-snug">
          {title} in {citySlug?.charAt(0).toUpperCase() + citySlug?.slice(1)}
          {productRating > 0 && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
              <span className="text-yellow-500 font-semibold">
                ⭐ {productRating}
              </span>

              <span>({productReviewCount} reviews)</span>
            </div>
          )}
        </HeadingTag >

        {/* {productdescription && (
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            {productdescription}
          </p>
        )} */}

        <div className="flex flex-wrap gap-2 mt-4">
          {highlights?.isFeatured && <Badge text="Featured" />}
          {highlights?.isTopRented && (
            <Badge text="Top Rented" color="bg-yellow-500" />
          )}
          {highlights?.isBestDeal && (
            <Badge text="Best Deal" color="bg-green-600" />
          )}
        </div>
      </div>

      {/* ================= PRICING + BOOKING CARD ================= */}
      <div className="p-6 border rounded-2xl bg-white shadow-sm space-y-4">
        {/* Price Section */}
        <div>
          <p className="text-sm text-gray-500">Starting From</p>

          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-black">₹{price}</p>

            {pricing?.discountedPrice && pricing?.minPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{pricing.minPrice}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500">per {pricing?.unit}</p>
        </div>
        {locationContext?.deliveryNote && (
          <p className="text-xs text-gray-500 mt-2">
            {locationContext.deliveryNote}
          </p>
        )}

        {/* Extra Charges */}
        {/* <div className="space-y-1 text-sm text-gray-600">
          {pricing?.securityDeposit > 0 && (
            <p>
              Security Deposit:{" "}
              <span className="font-medium">
                ₹{pricing.securityDeposit}
              </span>
            </p>
          )}

          {pricing?.serviceCharge > 0 && (
            <p>
              Service Charge:{" "}
              <span className="font-medium">
                ₹{pricing.serviceCharge}
              </span>
            </p>
          )}
        </div> */}

        {/* Divider */}
        <div className="border-t pt-6 space-y-4">
          {/* Call Button */}
          <a
            href="tel:7672876321"
            className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 rounded-xl font-medium hover:scale-[1.02] transition duration-200 shadow-md"
          >
            <Phone size={18} />
            Call to Book Now
          </a>

          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/917672876321?text=${encodeURIComponent(
              whatsappMessage,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition duration-200 shadow-md"
          >
            <MessageCircle size={18} />
            Book on WhatsApp
          </a>

          {locationContext?.expressAvailable && (
            <p className="text-xs text-green-600 text-center mt-2">
              Express delivery available in {citySlug}
            </p>
          )}

          {locationContext?.demandLevel === "high" && (
            <p className="text-xs text-orange-600 text-center">
              High demand in {citySlug}. Book early.
            </p>
          )}

          {/* Trust Section */}
          <div className="bg-gray-50 border rounded-xl p-4 text-center mt-4 flex flex-col items-center gap-2">
            <ShieldCheck className="text-green-600" size={22} />
            <p className="text-xs text-gray-500">
              Instant confirmation • No hidden charges
            </p>
            <p className="text-sm font-semibold text-gray-900">
              Verified rental providers in {citySlug}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= BADGE COMPONENT ================= */
function Badge({ text, color = "bg-black" }) {
  return (
    <span className={`${color} text-white text-xs px-3 py-1 rounded-full`}>
      {text}
    </span>
  );
}
