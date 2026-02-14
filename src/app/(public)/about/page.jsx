export const metadata = {
  title: "About Us | KirayNow",
  description:
    "Learn more about KirayNow – India's trusted rental marketplace connecting users with verified vendors for events and celebrations.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* HERO SECTION */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            About KirayNow
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            KirayNow is a modern rental marketplace built to bring transparency,
            reliability, and convenience to the event rental industry. We connect
            customers with verified local vendors for seamless event planning.
          </p>
        </div>

        {/* OUR MISSION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The rental industry has long suffered from price confusion, lack of
            transparency, and inconsistent service quality. Our mission is to
            simplify this experience by providing a trusted digital platform
            where customers can easily discover and connect with reliable
            rental service providers.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We aim to create a structured and professional rental ecosystem
            where both customers and vendors benefit from clarity, visibility,
            and better communication.
          </p>
        </div>

        {/* WHAT WE DO */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              What We Do
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>✔️ List verified rental services and products</li>
              <li>✔️ Connect users directly with local vendors</li>
              <li>✔️ Provide transparent pricing visibility</li>
              <li>✔️ Simplify event planning decisions</li>
              <li>✔️ Promote trusted service providers</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              What We Are Not
            </h3>
            <p className="text-gray-600 leading-relaxed">
              KirayNow is a marketplace platform. We do not directly provide
              rental services. All bookings, service execution, and agreements
              happen directly between the customer and the vendor.
            </p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            How KirayNow Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-black text-white rounded-full text-lg font-semibold">
                1
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">
                Browse Services
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                Explore rental services and products available in your city.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-black text-white rounded-full text-lg font-semibold">
                2
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">
                Connect with Vendors
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                Contact vendors directly via call or WhatsApp.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-black text-white rounded-full text-lg font-semibold">
                3
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">
                Finalize Booking
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                Discuss details and finalize directly with the provider.
              </p>
            </div>
          </div>
        </div>

        {/* TRANSPARENCY SECTION */}
        <div className="bg-gray-900 text-white rounded-2xl p-10 md:p-14 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Building Transparency in the Rental Market
          </h2>
          <p className="max-w-3xl mx-auto text-gray-300 leading-relaxed">
            KirayNow exists to bring structure and clarity to the rental
            ecosystem. By showcasing verified vendors and standardized
            information, we empower users to make confident decisions.
            Our goal is not just listings — but a better rental experience
            for everyone involved.
          </p>
        </div>

      </div>
    </div>
  );
}
