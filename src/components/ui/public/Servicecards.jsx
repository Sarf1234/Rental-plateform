import ServiceCard from "./ServiceProductCard";

export default function Servicecards({
  data = [],
  title = "Hot Deals",
  subtitle = "",
  citySlug,
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      {/* HEADER */}
      <div className="mb-6 max-w-2xl">
        <h2 className="md:text-xl text-base inline-block font-semibold text-gray-900 border-b-4 border-[#003459] pb-2 ">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <div className="text-gray-500 py-10">
          No services available.
        </div>
      )}

      {/* 🔥 MOBILE: HORIZONTAL SCROLL */}
      {data.length > 0 && (
        <>
          <div className="relative sm:hidden">

            {/* scroll hint */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {data.slice(0, 8).map((service) => (
                <div key={service._id} className="min-w-[80%]">
                  <ServiceCard
                    service={service}
                    citySlug={citySlug}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 💻 DESKTOP GRID */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.slice(0, 8).map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                citySlug={citySlug}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}