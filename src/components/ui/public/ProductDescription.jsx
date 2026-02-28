export default function ProductDescription({ 
  description, 
  title, 
  cityData, 
  pricing 
}) {
  if (!description) return null;

  const cityName = cityData?.name;
  const subAreas = cityData?.subAreas || [];
  const topAreas = subAreas.slice(0, 3).map((a) => a.name).join(", ");

  const primaryPrice =
      pricing?.minPrice || pricing?.discountedPrice

  return (
    <div className="mt-16">

      {/* ===================== */}
      {/* 🔥 CITY CONTEXT BLOCK */}
      {/* ===================== */}
      {cityName && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            Rental Details & Specifications
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Looking for {title.toLowerCase()} rental in {cityName}? 
            We provide professional delivery and setup services 
            {topAreas && ` across ${topAreas}`} and nearby areas. 
            With pricing starting from ₹{primaryPrice} per {pricing?.unit}, 
            this product is suitable for weddings, receptions, 
            corporate events and private celebrations in {cityName}.
          </p>
        </section>
      )}

      {/* ===================== */}
      {/* 📦 PRODUCT DETAILS */}
      {/* ===================== */}
      {/* <h2 className="text-2xl font-semibold mb-4">
        Product Details
      </h2> */}

      <div
        className="prose max-w-none content"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {/* ===================== */}
      {/* 📍 SERVICE AREAS */}
      {/* ===================== */}
      {topAreas && (
        <div className="mt-8 text-sm  text-gray-600 border-t pt-4">
          We regularly deliver {title.toLowerCase()} rentals in {cityName}, 
          including {topAreas} and surrounding localities.
        </div>
      )}
    </div>
  );
}