import Link from "next/link";
import ProductsCards from "./ProductCards";

export default function FlagsCards({
  data = [],
  title = "Hot Deals",
  citySlug,
}) {
  if (!data.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="md:text-xl text-base font-semibold text-gray-900 border-b-4 border-[#003459] pb-2 ">
          {title}
        </h2> 
      </div>

      {/* 🔥 MOBILE: HORIZONTAL SCROLL */}
      <div className="relative sm:hidden">

        {/* fade effect */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {data.slice(0, 8).map((item) => (
            <div key={item._id} className="min-w-[75%]">
              <ProductsCards
                product={item}
                citySlug={citySlug}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 💻 DESKTOP GRID */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.slice(0, 8).map((item) => (
          <ProductsCards
            key={item._id}
            product={item}
            citySlug={citySlug}
          />
        ))}
      </div>

    </section>
  );
}