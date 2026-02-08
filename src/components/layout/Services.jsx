import { Truck, Headset, ShoppingCart, RefreshCw } from "lucide-react";

export default function Services({ city = "Patna" }) {
  const services = [
    {
      icon: <Truck className="w-8 h-8 text-[#003459]" />,
      title: "On-Time Rental Delivery",
      description: `We ensure timely delivery and professional setup of your rental products anywhere in ${city}. No delays, no last-minute surprises.`,
    },
    {
      icon: <Headset className="w-8 h-8 text-[#003459]" />,
      title: "24/7 Customer & Event Support",
      description:
        "Our dedicated support team is available before, during, and after your event to assist with customization and urgent requirements.",
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-[#003459]" />,
      title: "Simple & Flexible Booking",
      description:
        "Book your rental items in just a few clicks with transparent pricing and flexible rental duration options.",
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-[#003459]" />,
      title: "Hassle-Free Pickup & Returns",
      description:
        "Once your event is complete, our team handles pickup efficiently without hidden charges or unnecessary paperwork.",
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
          Why Choose Our Services in {city}?
        </h2>

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
