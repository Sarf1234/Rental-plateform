import ProductsCards from "./ProductCards";


export default function FlagsCards({ data = [], title = "Hot Deals" }) {
 
  return (
    <section className="max-w-7xl mx-auto py-10">
      <div className="px-4">

        {/* Section Header */}
        <div className="border-b-4 border-[#003459] inline-block pb-2 mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {/* Grid */}
        {data.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {data.map((service) => (
              <ProductsCards
                key={service._id}
                product={service}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 py-10">
            No services available.
          </div>
        )}

      </div>
    </section>
  );
}
