import { Truck, Headset, ShoppingCart, RefreshCw } from "lucide-react";

export default function Services({
  city = "Patna",
  subAreas = [],
  totalServices = 0,
}) {
  // Pick top 2 subareas (priority-based data already sorted from backend recommended)
  const topAreas = subAreas.slice(0, 2).map((area) => area.name);

  const areasText =
    topAreas.length > 0
      ? topAreas.join(" and ")
      : `major locations in ${city}`;

  const services = [
    {
      icon: <Truck className="w-8 h-8 text-[#003459]" />,
      title: "On-Time Rental Delivery",
      description: `We ensure timely delivery and professional setup of rental products across ${areasText}, ${city}. Our local team guarantees punctual service without last-minute surprises.`,
    },
    {
      icon: <Headset className="w-8 h-8 text-[#003459]" />,
      title: `Dedicated ${city} Event Support`,
      description: `Our support team in ${city} understands local venue requirements and event logistics, ensuring smooth coordination before, during, and after your booking.`,
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-[#003459]" />,
      title: "Simple & Flexible Booking",
      description: `Choose from ${totalServices}+ rental options available in ${city}. Book instantly with transparent pricing and flexible rental durations tailored for events in ${areasText}.`,
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-[#003459]" />,
      title: "Hassle-Free Pickup & Returns",
      description: `Once your event in ${city} is complete, our professional team handles pickup efficiently across ${areasText} without hidden charges or unnecessary paperwork.`,
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">

        {/* Section Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
          Why We’re Trusted for Event Rentals in {city}
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Delivering reliable rental services across {areasText}, our team ensures
          seamless event execution with professional support and transparent pricing.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-blue-50 rounded-full">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#003459] mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
