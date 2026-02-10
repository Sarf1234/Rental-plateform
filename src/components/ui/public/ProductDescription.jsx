export default function ProductDescription({ 
  description, 
  title, 
  cityData, 
  pricing 
}) {
  if (!description) return null;

  const cityName = cityData?.name;
  const topAreas = cityData?.subAreas
    ?.slice(0, 3)
    .map((a) => a.name)
    .join(", ");

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-6">
        Product Details
      </h2>

      {/* 🔹 SEO INTRO */}
      {cityName && (
        <p className=" mb-6 leading-relaxed">
          {title} is available for rent in {cityName}. Ideal for weddings,
          birthday parties, corporate events and private celebrations.
          Pricing starts from ₹
          {pricing?.discountedPrice || pricing?.minPrice} per {pricing?.unit}.
        </p>
      )}

      {/* 🔹 ORIGINAL DESCRIPTION */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {/* 🔹 SUBAREAS CONTEXT */}
      {topAreas && (
        <p className="mt-6 text-sm text-gray-600">
          Serving major areas of {cityName} including {topAreas}.
        </p>
      )}
    </div>
  );
}
