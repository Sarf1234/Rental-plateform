import Image from "next/image";
import { apiRequest } from '@/lib/api';
import Link from "next/link";

export default async function ServiceDetailsPage({params}) {
  

  const { serviceSlug, slug } = await params;
     let featured = [];
 
     
       try {
         const res = await apiRequest(
           `${process.env.NEXT_PUBLIC_API_URL}/api/service/${serviceSlug}`
         );
         featured = res.data || [];
         
    
       } catch (err) {
         console.error("Failed to fetch categories:", err);
       }



  if (!featured) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 mt-16">

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-3">
            <LeftSidebar service={featured} />
          </div>

          {/* CENTER CONTENT */}
          <div className="lg:col-span-6">
            <CenterContent service={featured}  city={slug}/>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-3">
            <RightSidebar service={featured} />
          </div>

        </div>
      </div>
    </div>
  );
}


function LeftSidebar({ service }) {
  return (
    <div className="lg:sticky lg:top-20 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">

      {/* Title Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 leading-snug">
          {service.title}
        </h2>

        {/* Highlight Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {service.isTopService && (
            <span className="px-3 py-1 text-xs font-medium bg-black text-white rounded-full">
              Top Service
            </span>
          )}
          {service.isBestService && (
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
              Best Rated
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Service Areas */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
          Available In
        </h4>

        <div className="flex flex-wrap gap-2">
          {service.serviceAreas.map(area => (
            <span
              key={area._id}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-black hover:text-white transition cursor-pointer"
            >
              {area.name}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Features */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
          What's Included
        </h4>

        <ul className="space-y-3">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 group">
              
              {/* Check Icon */}
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-black text-white text-xs mt-1 group-hover:scale-110 transition">
                ✓
              </div>

              <span className="text-sm text-gray-700 leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}





function CenterContent({ service, city}) {

  

  return (
    <div className="space-y-12">

        {/* ========== IMAGE GALLERY (Hero Style) ========== */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">

        <div className="grid grid-cols-3 gap-3 h-[320px]">

          {/* Main Large Image */}
          <div className="relative col-span-2 rounded-xl overflow-hidden group">
            <Image
              src={service.images[0]}
              alt="service"
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          {/* Side Images */}
          <div className="grid grid-rows-2 gap-3">
            {service.images.slice(1, 3).map((img, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden group"
              >
                <Image
                  src={img}
                  alt="service"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ================= PRODUCTS ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

        <h3 className="text-2xl font-semibold text-gray-900 mb-8">
          Rental Products
        </h3>

        <div className="grid md:grid-cols-2 gap-8">

          {service.products?.map(product => {
  const price =
    product.pricing?.discountedPrice ||
    product.pricing?.minPrice;

  return (
    <Link
      key={product._id}
      href={`/city/${city}/products/${product.slug}`}
      className="group block border border-gray-100 rounded-2xl overflow-hidden bg-white hover:shadow-2xl hover:-translate-y-1 transition duration-300"
    >

      {/* Product Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.title}
          fill
          className="object-fill group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Product Content */}
      <div className="p-5 space-y-4">

        <h4 className="font-semibold text-gray-900 leading-snug line-clamp-2">
          {product.title}
        </h4>

        {/* Price */}
        <div>
          <p className="text-xs text-gray-500">
            Starting From
          </p>

          <p className="text-2xl font-bold text-black">
            ₹{price}
          </p>

          <p className="text-xs text-gray-500">
            per {product.pricing?.unit}
          </p>
        </div>

      </div>

    </Link>
  );
})}


        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          How It Works
        </h3>

        <div className="space-y-6">
          {service.serviceProcess.map((step, index) => (
            <div key={step._id} className="flex gap-4 group">

              {/* Step Number Circle */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm font-semibold group-hover:scale-110 transition">
                  {step.step}
                </div>

                {/* Vertical Line */}
                {index !== service.serviceProcess.length - 1 && (
                  <div className="w-px bg-gray-200 flex-1 mt-2"></div>
                )}
              </div>

              {/* Step Content */}
              <div>
                <h4 className="font-semibold text-gray-900">
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>



      {/* ================= FAQ SECTION ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

        <h3 className="text-2xl font-semibold text-gray-900 mb-8">
          Frequently Asked Questions
        </h3>

        <FAQSection faqs={service.faqs} />

      </div>

    </div>
  );
}




function RightSidebar({ service }) {
  return (
    <div className="lg:sticky lg:top-20 space-y-6">

      {/* ========== CONTACT / CTA CARD ========== */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-5">

        {/* Title */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Get a Free Quote
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Quick response within 30 minutes
          </p>
        </div>

        {/* Highlight Trust Badge */}
        <div className="bg-gray-50 border rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500">Trusted by Clients</p>
          <p className="text-sm font-semibold text-gray-900">
            Verified Event Professionals
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">

          <a
            href={`tel:${service.callNumber}`}
            className="block w-full text-center bg-black text-white py-3 rounded-xl font-medium hover:scale-[1.02] transition duration-200"
          >
            Call Now
          </a>

          <a
            href={`https://wa.me/${service.whatsappNumber}`}
            target="_blank"
            className="block w-full text-center bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition duration-200"
          >
            WhatsApp Now
          </a>

        </div>

        {/* Sub Info */}
        <p className="text-xs text-gray-400 text-center">
          No booking fee • Instant support
        </p>

      </div>


      {/* ========== PROVIDERS CARD ========== */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

        <h3 className="text-lg font-semibold text-gray-900 mb-5">
          Available Providers
        </h3>

        <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">

          {service.providers.map(provider => (
            <div
              key={provider._id}
              className="p-4 border border-gray-100 rounded-xl hover:shadow-md hover:-translate-y-1 transition duration-300 bg-gray-50 hover:bg-white"
            >

              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900 text-sm">
                  {provider.name}
                </p>

                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                  Verified
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                📞 {provider.phone}
              </p>

              <a
                href={`tel:${provider.phone}`}
                className="mt-3 inline-block text-sm font-medium text-black hover:underline"
              >
                Contact Provider →
              </a>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}


function FAQSection({ faqs }) {
  return (
    <div className="space-y-4">

      {faqs.map((faq, index) => (
        <details
          key={index}
          className="group border border-gray-100 rounded-xl overflow-hidden bg-white"
        >
          <summary className="flex justify-between items-center p-5 cursor-pointer list-none bg-gray-50 hover:bg-gray-100 transition">

            <span className="font-medium text-gray-900 text-sm">
              {faq.question}
            </span>

            <span className="text-lg transition group-open:rotate-45">
              +
            </span>

          </summary>

          <div className="px-5 pb-5 text-sm text-gray-600 border-t border-gray-100 leading-relaxed">
            {faq.answer}
          </div>
        </details>
      ))}

    </div>
  );
}



