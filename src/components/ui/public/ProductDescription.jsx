export default function ProductDescription({
  description,
  title,
  cityData,
  pricing,
  locationContext,
}) {
  if (!description) return null;

  const cityName = cityData?.name;
  const subAreas = cityData?.subAreas || [];
  const topAreas = subAreas
    .slice(0, 3)
    .map((a) => a.name)
    .join(", ");

  const primaryPrice = pricing?.minPrice || pricing?.discountedPrice;

  const hasCustomIntro = locationContext?.customIntro?.trim();

  return (
    <div className="mt-16">
      {/* ===================== */}
      {/* 🔥 TITLE (ALWAYS SHOW) */}
      {/* ===================== */}
      {cityName && (
        <h2 className="text-xl font-semibold mb-3">
          {title} in {cityName} – Details & Pricing
        </h2>
      )}

      {/* ===================== */}
      {/* 🧠 CONTENT LOGIC */}
      {/* ===================== */}

      {/* 👉 CUSTOM INTRO (PRIORITY) */}
      {hasCustomIntro ? (
        <div className="mb-6 text-gray-700 leading-relaxed whitespace-pre-line">
          {locationContext.customIntro}
        </div>
      ) : (
        cityName && (
          <p className="mb-6 text-gray-700 leading-relaxed">
            Looking for {title.toLowerCase()} in {cityName}? We provide
            professional delivery and setup services
            {topAreas && ` across ${topAreas}`} and nearby areas. With pricing
            starting from ₹{primaryPrice} per {pricing?.unit}, this product is
            suitable for weddings, receptions, corporate events and private
            celebrations in {cityName}.
          </p>
        )
      )}

      {/* ===================== */}
      {/* 📄 PRODUCT DESCRIPTION */}
      {/* ===================== */}
      <div
        className="prose max-w-none content"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {/* ===================== */}
      {/* 📍 SERVICE AREAS */}
      {/* ===================== */}

      {locationContext?.trendingText?.trim() ? (
        <p className="mt-6 text-sm text-blue-600 whitespace-pre-line">
          {locationContext.trendingText}
        </p>
      ) : (
        cityName &&
        topAreas && (
          <div className="mt-6 text-sm text-gray-600 border-t pt-4">
            We regularly deliver {title.toLowerCase()} rentals in {cityName},
            including {topAreas} and surrounding localities.
          </div>
        )
      )}

      {locationContext?.seasonalNote && (
        <div className="mt-6 text-sm text-gray-600">
          {locationContext.seasonalNote}
        </div>
      )}
    </div>
  );
}
