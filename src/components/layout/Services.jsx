import { Truck, Headset, ShoppingCart, RefreshCw } from "lucide-react";

export default function Services({
  city = "Patna",
  subAreas = [],
  totalServices = 0,
  seasonalNote,
  deliveryNote,
  trendingText,
  expressAvailable,
  demandLevel,
}) {
  const topAreas = subAreas?.map((area) => area.name);

  const areasText =
    topAreas.length > 0
      ? topAreas.join(" and ")
      : `major locations in ${city}`;

  const services = [
    {
      icon: <Truck className="w-8 h-8 text-[#003459]" />,
      title: "On-Time Rental Delivery",
      description: deliveryNote
        ? deliveryNote
        : `We ensure timely delivery and setup across ${areasText}, ${city}.`,
    },
    {
      icon: <Headset className="w-8 h-8 text-[#003459]" />,
      title: `Dedicated ${city} Support`,
      description: `Local support team ensures smooth coordination for your events.`,
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-[#003459]" />,
      title: "Simple Booking",
      description: `Choose from ${totalServices}+ rental options with transparent pricing.`,
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-[#003459]" />,
      title: "Easy Returns",
      description: `Hassle-free pickup and returns across ${areasText}.`,
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8 max-w-2xl">
          <h2 className="md:text-2xl text-base font-semibold text-gray-900">
            Why Choose Us in {city}
          </h2>

          <p className="text-gray-600 text-sm mt-2">
            {seasonalNote ||
              `Reliable rental services across ${areasText} with professional support.`}
          </p>
        </div>

        {/* 🔥 MOBILE SCROLL */}
        <div className="relative sm:hidden">

          {/* scroll hint */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-gray-50 to-transparent z-10" />

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {services.map((service, index) => (
              <div key={index} className="min-w-[80%]">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>

        {/* 💻 DESKTOP GRID */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>

        {/* SUBTLE CONTEXT LINE */}
        {(demandLevel === "high" || expressAvailable) && (
          <p className="text-xs text-gray-500 mt-6">
            {demandLevel === "high" && `${city} has high rental demand. `}
            {expressAvailable && `Fast delivery options available.`}
          </p>
        )}

      </div>
    </section>
  );
}

/* 🔥 Separate clean card (reusable) */
function ServiceCard({ service }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="mb-3 p-2 bg-blue-50 rounded-lg w-fit">
        {service.icon}
      </div>

      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        {service.title}
      </h3>

      <p className="text-xs text-gray-600 leading-relaxed">
        {service.description}
      </p>
    </div>
  );
}