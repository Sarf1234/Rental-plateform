export const metadata = {
  title: "Frequently Asked Questions | KirayNow",
  description:
    "Find answers to common questions about booking rental products and services on KirayNow.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Here are some common questions about how KirayNow works,
            booking process, vendors, and rental services.
          </p>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-6">

          {[
            {
              q: "What is KirayNow?",
              a: "KirayNow is a rental marketplace platform that connects customers with verified vendors offering event and celebration rental services.",
            },
            {
              q: "Does KirayNow provide the products directly?",
              a: "No. KirayNow is a marketplace platform. Rental products and services are provided by independent vendors listed on our platform.",
            },
            {
              q: "How do I book a service or product?",
              a: "You can contact the vendor directly via call or WhatsApp using the contact details available on the listing page.",
            },
            {
              q: "Is there any booking fee?",
              a: "KirayNow does not charge customers any booking fee. Pricing and payment terms are decided by the vendor.",
            },
            {
              q: "Can I negotiate pricing with vendors?",
              a: "Yes. Since vendors handle bookings directly, pricing discussions and final agreements are done between you and the vendor.",
            },
            {
              q: "What if I face issues with a vendor?",
              a: "KirayNow may assist in communication, but service execution and disputes are handled directly between customer and vendor.",
            },
            {
              q: "Are vendors verified?",
              a: "We aim to list verified and professional vendors. However, customers are encouraged to confirm details before finalizing any booking.",
            },
            {
              q: "Can I cancel my booking?",
              a: "Cancellation policies depend on the vendor’s terms. Please confirm cancellation conditions before making payment.",
            },
            {
              q: "Does KirayNow handle payments?",
              a: "Currently, most payments are handled directly between customers and vendors. Platform payment features may be introduced in the future.",
            },
            {
              q: "Which cities are supported?",
              a: "KirayNow operates city-wise. You can explore available services and products in your city through the city-specific pages.",
            },
          ].map((item, index) => (
            <details
              key={index}
              className="group bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
            >
              <summary className="flex justify-between items-center cursor-pointer px-6 py-5 font-medium text-gray-900 list-none hover:bg-gray-50 transition">
                {item.q}
                <span className="transition group-open:rotate-45 text-xl">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}

        </div>

      </div>
    </div>
  );
}
