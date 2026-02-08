export default function ProductInfo({ title, pricing, highlights, productdescription }) {
  const price = pricing?.discountedPrice || pricing?.minPrice;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {title}
        </h1>

        <p className="text-sm text-gray-800">{productdescription}</p>
        

        <div className="flex flex-wrap gap-2 mt-4">
          {highlights?.isFeatured && (
            <Badge text="Featured" />
          )}
          {highlights?.isTopRented && (
            <Badge text="Top Rented" color="bg-yellow-500" />
          )}
          {highlights?.isBestDeal && (
            <Badge text="Best Deal" color="bg-green-600" />
          )}
        </div>
      </div>

      <div className="p-6 border rounded-2xl bg-gray-50 space-y-4">

        <div>
          <p className="text-sm text-gray-500">
            Starting From
          </p>

          <p className="text-3xl font-bold text-black">
            ₹{price}
          </p>

          <p className="text-sm text-gray-500">
            per {pricing?.unit}
          </p>
        </div>

        {pricing?.securityDeposit > 0 && (
          <p className="text-sm text-gray-600">
            Security Deposit: ₹{pricing.securityDeposit}
          </p>
        )}

        {pricing?.serviceCharge > 0 && (
          <p className="text-sm text-gray-600">
            Service Charge: ₹{pricing.serviceCharge}
          </p>
        )}

        <button className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
          Rent Now
        </button>

      </div>

    </div>
  );
}


function Badge({ text, color = "bg-black" }) {
  return (
    <span className={`${color} text-white text-xs px-3 py-1 rounded-full`}>
      {text}
    </span>
  );
}