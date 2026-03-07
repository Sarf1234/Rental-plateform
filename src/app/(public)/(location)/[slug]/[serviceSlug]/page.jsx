import Image from "next/image";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import ProductCard from "@/components/ui/public/ProductCards";
import ServiceGallery from "@/components/ui/public/ServiceGallery";

export async function generateMetadata({ params }) {
  const { serviceSlug, slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/service/${serviceSlug}?city=${slug}`,
      { next: { revalidate: 3600 } },
    );

    const result = await res.json();

    if (!result?.data) {
      return {
        title: "Service Not Found",
        robots: { index: false, follow: false },
      };
    }

    const service = result.data;
    const city = result.city;
    const locationProfile = service.locationContext || null;
    

    const cityName = city?.name || "";
    const brandName = "KirayNow"; // replace later

    const primaryPrice =
      service?.pricing?.minPrice ||
      service?.pricing?.discountedPrice ||
      service?.pricing?.amount ||
      null;

    // Base meta from backend
    const baseTitle =  service.seo?.metaTitle || service.title;

    const baseDescription = 
      service.seo?.metaDescription ||
      service.description?.replace(/<[^>]+>/g, "").slice(0, 140);

    const title = locationProfile?.seoTitleOverride || `${baseTitle} in ${cityName} – From ${primaryPrice} `;

    const description = locationProfile?.seoDescriptionOverride || `${baseDescription} Available across ${cityName}${
      city?.subAreas?.length
        ? ` including ${city.subAreas
            .slice(0, 3)
            .map((a) => a.name)
            .join(", ")}`
        : ""
    }.`;

    const image =
      service.seo?.ogImage ||
      service.images?.[0] ||
      "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp";

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kiraynow.com";
    const url = `${baseUrl}/${slug}/${serviceSlug}`;

    return {
      metadataBase: new URL("https://kiraynow.com"),
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        siteName: "KirayNow",
        type: "website",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: `${service.title} in ${cityName} - KirayNow`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      robots: {
        index: service.seo?.noIndex ? false : true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: "Service",
      description: "Rental services",
    };
  }
}

export default async function ServiceDetailsPage({ params }) {
  const { serviceSlug, slug } = await params;
  let featured = [];
  let cityData = [];
  let locationProfile = null;

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/service/${serviceSlug}?city=${slug}`,
    );
    featured = res.data || [];
    cityData = res.city;
    locationProfile = res.data?.locationContext || null;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }

  if (!featured) return <div className="p-10">Loading...</div>;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kiraynow.com";
  const cityName = cityData?.name || "";
  const service = featured;
  const serviceUrl = `${baseUrl}/${slug}/${serviceSlug}`;

  const primaryProvider = service.providers?.[0];
  // =============================
// 🔥 MODIFY SERVICE FAQ HERE
// =============================

const pricingKeywords = [
  "price",
  "cost",
  "charges",
  "package",
  "rent",
  "how much"
];

const rawFaqs = service.faqs || [];

const modifiedFaqs = rawFaqs.map((faq) => {
  let question = faq.question;
  let answer = faq.answer;

  if (cityName) {
    // 1️⃣ Placeholder support
    if (question.includes("{city}")) {
      question = question.replace("{city}", cityName);
    }

    if (answer.includes("{city}")) {
      answer = answer.replace("{city}", cityName);
    }

    // 2️⃣ Inject city in pricing intent questions
    const lowerQ = question.toLowerCase();

    const shouldInject =
      pricingKeywords.some((keyword) =>
        lowerQ.includes(keyword)
      ) &&
      !lowerQ.includes(cityName.toLowerCase());

    if (shouldInject) {
      if (question.includes("?")) {
        question = question.replace("?", ` in ${cityName}?`);
      } else {
        question = `${question} in ${cityName}`;
      }
    }
  }

  return {
    ...faq,
    question,
    answer,
  };
});

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // 🔹 Platform Organization
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "KirayNow",
        url: baseUrl,
        logo: "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
      },
      // 🔹 Breadcrumb
      {
        "@type": "BreadcrumbList",
        "@id": `${serviceUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: cityName,
            item: `${baseUrl}/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: serviceUrl,
          },
        ],
      },

      // 🔹 Marketplace Service Listing
      {
        "@type": "Service",
        "@id": `${serviceUrl}#service`,
        mainEntityOfPage: serviceUrl,
        name: `${service.title} in ${cityName}`,
        description:
          service.description?.replace(/<[^>]+>/g, "").slice(0, 250) ||
          `${service.title} service available in ${cityName}.`,
        provider: {
          "@id": `${baseUrl}/#organization`,
        },
        areaServed: {
          "@type": "City",
          name: cityName,
        },
        image:
          service.images?.[0] ||
          "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",

        offers: {
          "@type": "Offer",
          url: serviceUrl,
          priceCurrency: "INR",
          price: service.pricing?.amount || "10000",
          availability: "https://schema.org/InStock",

          seller: primaryProvider
            ? {
                "@type": "LocalBusiness",
                name: primaryProvider.name,
                telephone: primaryProvider.phone,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: cityName,
                  addressCountry: "IN",
                },
              }
            : undefined,
        },
      },

      // 🔹 FAQ Schema
      {
        "@type": "FAQPage",
        mainEntity: [
          ...(modifiedFaqs || []).slice(0, 5).map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="max-w-7xl mx-auto md:px-4 py-6">
        {/* 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-6">
          {/* CENTER FIRST ON MOBILE */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <CenterContent
              service={featured}
              city={slug}
              cityData={cityData}
              locationProfile={locationProfile}
              modifiedFaqs={modifiedFaqs}
            />
          </div>

          {/* LEFT SECOND ON MOBILE */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            <LeftSidebar
              service={featured}
              cityData={cityData}
              locationProfile={locationProfile}
            />
          </div>

          {/* RIGHT THIRD ON MOBILE */}
          <div className="order-3 lg:order-3 lg:col-span-3">
            <RightSidebar
              service={featured}
              cityData={slug}
              locationProfile={locationProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftSidebar({ service, cityData, locationProfile }) {
  return (
    <div className="lg:sticky lg:top-20 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      {/* Title Section */}
      

      {/* Divider */}
      {/* <div className="border-t border-gray-100"></div> */}

      {/* Service Areas */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
          Available Across
        </h4>

        

        <div className="flex flex-wrap gap-2">
          {cityData.subAreas.map((area) => (
            <span
              key={area._id}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-black hover:text-white transition cursor-pointer"
            >
              {area.name}
            </span>
          ))}
        </div>
      </div>
      {locationProfile?.trendingText && (
          <p className="mt-4 text-xs text-gray-500">
            {locationProfile.trendingText}
          </p>
        )}

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

function CenterContent({ service, city, cityData, locationProfile, modifiedFaqs }) {
  

  const cityName = cityData?.name;
  const topAreas = cityData?.subAreas
    ?.slice(0, 3)
    .map((a) => a.name)
    .join(", ");

  return (
    <div className="md:space-y-12">
      {/* ========== IMAGE GALLERY (Hero Style) ========== */}
      <ServiceGallery images={service.images} />

      <div className="lg:hidden">
        <ContactCTA
          service={service}
          citySlug={cityData}
          locationProfile={locationProfile}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

      <h1 className="text-3xl font-bold text-gray-900">
        {service.title} in {cityName}
      </h1>

      <p className="mt-4 text-gray-600 leading-relaxed">
        {locationProfile?.customIntro
          ? locationProfile.customIntro
          : `Looking for professional ${service.title.toLowerCase()} in ${cityName}? We provide customized and reliable setups across major areas like ${topAreas}. Packages start from ₹${service.pricing?.amount}.`}
      </p>

      {/* 🔥 Demand Level Indicator */}
      {locationProfile?.demandLevel === "high" && (
        <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">
          High demand service in {cityName}
        </p>
      )}

      </div>

      {/* ===== ORIGINAL DESCRIPTION FROM BACKEND ===== */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: service.description }}
        />
        {locationProfile?.seasonalNote && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Market Trend in {cityName}
            </h3>
            <p className="text-gray-600 mt-2">{locationProfile.seasonalNote}</p>
          </div>
        )}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">
            {service.title} Service in {cityName}
          </h2>

          <p className="text-gray-600 mt-2">
            Our {service.title.toLowerCase()} services are frequently booked in{" "}
            {topAreas}. We customize setup according to venue size, guest
            capacity, and event type in {cityName}.
          </p>
        </div>

        {/* ===== CITY CLOSING CONTEXT ===== */}
        <p className="mt-6 text-gray-600">
          Our team ensures timely setup and professional execution across{" "}
          {cityName}, making your event stress-free and memorable.
        </p>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8">
          Rental Products
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {service.products?.map((product) => (
    <ProductCard
      key={product._id}
      product={product}
      citySlug={city}
    />
  ))}
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
                <h4 className="font-semibold text-gray-900">{step.title}</h4>
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

        <FAQSection faqs={[...modifiedFaqs]} />
      </div>
    </div>
  );
}

function RightSidebar({ service, cityData, locationProfile }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kiraynow.com";

  // ⚡ Generate dynamic WhatsApp message
  const message = `
Hi KirayNow Team 

I'm interested in *${service.title}*.

Starting Price: ₹${service.pricing?.amount}

Please share details, availability & best quotation.

Service Link:
${baseUrl}/${cityData}/${service.slug}

Thank you!
  `;

  const encodedMessage = encodeURIComponent(message.trim());

  const whatsappUrl = `https://wa.me/${service.whatsappNumber}?text=${encodedMessage}`;

  return (
    <div className="lg:sticky lg:top-20 space-y-6">
      {/* ========== CONTACT / CTA CARD ========== */}
      <div className="hidden lg:block">
        <ContactCTA
          service={service}
          citySlug={cityData}
          locationProfile={locationProfile}
        />
      </div>
      {/* ========== PROVIDERS CARD ========== */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">
          Available Providers
        </h3>

        <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
          {service.providers.map((provider) => (
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

              <p className="text-xs text-gray-500 mt-2">📞 {provider.phone}</p>

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

            <span className="text-lg transition group-open:rotate-45">+</span>
          </summary>

          <div className="px-5 pb-5 text-sm text-gray-600 border-t border-gray-100 leading-relaxed">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  );
}

function ContactCTA({ service, citySlug, locationProfile }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kiraynow.com";

  const message = `
Hi KirayNow Team 👋

I'm interested in *${service.title}*.

💰 Starting Price: ₹${service.pricing?.amount}

Please share details, availability & best quotation.

Service Link:
${baseUrl}/${citySlug}/${service.slug}

Thank you!
  `;

  const encodedMessage = encodeURIComponent(message.trim());
  const whatsappUrl = `https://wa.me/${service.whatsappNumber}?text=${encodedMessage}`;

  return (
    <div className="p-6 md:border md:rounded-2xl bg-white md:shadow-sm space-y-4">
      {/* Price Section */}
      <div>
        <p className="text-sm text-gray-500">Starting From</p>

        <div className="flex items-end gap-3">
          <p className="text-3xl font-bold text-black">
            ₹{service?.pricing?.amount}
          </p>

          {service?.pricing?.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{service?.pricing?.originalPrice}
            </span>
          )}
        </div>
        {locationProfile?.deliveryNote && (
          <p className="mt-4 text-xs text-gray-500">
            {locationProfile.deliveryNote}
          </p>
        )}

        <p className="text-sm text-gray-500">
          {service?.pricing?.type === "per_event"
            ? "per event"
            : service?.pricing?.type === "per_hour"
              ? "per hour"
              : ""}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t pt-6 space-y-4">
        {/* Call Button */}
        <a
          href={`tel:${service?.callNumber}`}
          className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 rounded-xl font-medium hover:scale-[1.02] transition duration-200 shadow-md"
        >
          Call to Book Now
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${service?.whatsappNumber}?text=${encodeURIComponent(
            `Hi, I'm interested in booking "${service?.title}". Please share full details.`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition duration-200 shadow-md"
        >
          Book on WhatsApp
        </a>

        {/* Trust Section */}
        <div className="bg-gray-50 border rounded-xl p-4 text-center mt-4">
          <p className="text-xs text-gray-500">
            {locationProfile?.expressAvailable
              ? "Express fulfillment available • Instant confirmation"
              : "Instant confirmation • No hidden charges"}
          </p>
          <p className="text-sm font-semibold text-gray-900">
            Verified Event Professionals
          </p>
        </div>
      </div>
    </div>
  );
}
