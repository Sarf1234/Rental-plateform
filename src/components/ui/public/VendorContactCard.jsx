export default function VendorContactCard({ vendor }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">

      <h3 className="text-lg font-semibold mb-4">
        Contact {vendor.name}
      </h3>

      {vendor.phone && (
        <a
          href={`tel:${vendor.phone}`}
          className="block w-full text-center bg-black text-white py-3 rounded-lg mb-3"
        >
          Call Now
        </a>
      )}

      {vendor.whatsappNumber && (
        <a
          href={`https://wa.me/${vendor.whatsappNumber}`}
          target="_blank"
          className="block w-full text-center bg-green-600 text-white py-3 rounded-lg"
        >
          WhatsApp
        </a>
      )}

      {vendor.website && (
        <a
          href={vendor.website}
          target="_blank"
          className="block mt-4 text-sm text-blue-600 underline"
        >
          Visit Website
        </a>
      )}

      <div className="mt-6 text-sm text-gray-600">

        {vendor.totalOrders && (
          <p>
            Orders completed: {vendor.totalOrders}
          </p>
        )}

        {vendor.serviceAreas?.length > 0 && (
          <p>
            Serving: {vendor.serviceAreas.map(a => a.name).join(", ")}
          </p>
        )}

      </div>

    </div>
  );
}