import Services from "@/components/layout/Services";
import { imagesLink, carouselContent } from "../../../../utils/seedData";
import HeroCarousel from "@/components/layout/HeroCrousel";
import Servicecards from "@/components/ui/public/Servicecards";
import { apiRequest } from "@/lib/api";
import ProductCategories from "@/components/ui/public/ProductCategories";
import RelatedBlogs from "@/components/layout/RelatedBlogs";
import ServiceCategories from "@/components/ui/public/ServiceCategories";
import ProductCard from "@/components/ui/public/ProductCards";
import VendorCard from "@/components/ui/public/VendorCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSlug } from "@/utils/isValidSlug";
import Script from "next/script";

export const revalidate = 86400; // ISR (1 hour)
export const dynamic = "force-static";

// 🔥 Dynamic Metadata Generator
export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (!slug || slug.startsWith(".")) {
    return {
      title: "Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
    const cityRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`,
    );

    const city = cityRes?.data;
    const locationContext = cityRes?.locationContext;
    if (!city) return {};

    const subAreasText =
      city.subAreas
        ?.slice(0, 2)
        .map((a) => a.name)
        .join(", ") || "";

    const title =
      locationContext?.seoTitleOverride ||
      `Affordable Birthday, Wedding & Party Rentals in ${city.name}`;
    const description =
      locationContext?.seoDescriptionOverride ||
      `Planning a celebration in ${city.name}? KirayNow helps you book trusted birthday decoration, wedding setups and party rental services${
        subAreasText ? ` across ${subAreasText}` : ""
      }. Compare packages, view transparent pricing and hire verified professionals for a hassle-free event experience.`;

    const url = `https://kiraynow.com/${city.slug}`;
    const ogImage =
      "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp";
    // Replace with your real OG generator or image

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
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `Event rentals in ${city.name}`,
          },
        ],
        locale: "en_IN",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (err) {
    return {};
  }
}

export default async function CityHome({ params }) {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    return notFound();
  }

  const baseUrl = "https://kiraynow.com";

  let featured = [];
  let top = [];
  let best = [];
  let all = [];

  let products = [];
  let vendors = [];

  let categories = [];
  let cityData = null;
  let locationProfile = null;

  let serviceCategories = [];

  try {
  const [
    serviceCatRes,
    cityRes,
    catRes,
    serviceRes,
  ] = await Promise.all([
    apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`
    ),

    apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`
    ),

    apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/categories`
    ),

    apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/service?city=${slug}&type=all&page=1&limit=10`
    ),
  ]);

  /* Assign Data */

  serviceCategories =
    serviceCatRes?.data || [];

  cityData =
    cityRes?.data || null;

  locationProfile =
    cityRes?.locationContext || null;

  categories =
    catRes?.data || [];

  featured =
    serviceRes?.featured || [];

  top =
    serviceRes?.top || [];

  best =
    serviceRes?.best || [];

  all =
    serviceRes?.all || [];

  products =
    serviceRes?.products || [];

  vendors =
    serviceRes?.vendors || [];

} catch (err) {
  console.error(
    "Parallel fetch failed:",
    err
  );
}

  if (!cityData) {
    return <div className="mt-20 text-center">City not found</div>;
  }

  const cityName = cityData.name;
  const subAreas = cityData.subAreas || [];
  const totalServices = all?.data?.length;

  // ==========================
  // 🔥 SCHEMA SECTION
  // ==========================

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // 🔹 Organization
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "KirayNow",
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },

      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "KirayNow",
        url: baseUrl,
        logo: "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
        description:
          "KirayNow is a trusted event rental marketplace offering birthday decoration, wedding setups and party rental services across multiple cities in India.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-7672876321",
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      },

      // 🔹 LocalBusiness
      {
        "@type": "Service",
        "@id": `${baseUrl}/${slug}#service`,
        name: `Birthday, Wedding & Party Rentals in ${cityName}`,
        provider: {
          "@id": `${baseUrl}/#organization`,
        },
        areaServed: {
          "@type": "City",
          name: cityName,
        },
        url: `${baseUrl}/${slug}`,
        image:
          "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
      },

      // 🔹 Breadcrumb
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/${slug}#breadcrumb`,
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
        ],
      },

      // 🔹 Services List
      {
        "@type": "ItemList",
        name: `Rental Services in ${cityName}`,
        itemListElement: all?.data?.slice(0, 10).map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/${slug}/${service.slug}`,
          name: service.title,
        })),
      },

      // {
      //   "@type": "ItemList",
      //     name: `Service Categories in ${cityName}`,
      //     itemListElement: serviceCategories.slice(0, 10).map((cat, index) => ({
      //       "@type": "ListItem",
      //       position: index + 1,
      //       url: `${baseUrl}/${slug}/service-categories/${cat.slug}`,
      //       name: cat.name,
      //     })),
      //   },

      ...(locationProfile?.faq.length > 0
  ? [
      {
        "@type": "FAQPage",
        mainEntity: locationProfile?.faq?.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ]
  : []),
    ],
  };

  // =========================
  // 🔥 SCHEMA SECTION END
  // =========================

  return (
    <>
    {/* 🔥 JSON-LD Injection */}
      <Script
        id="city-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    <div className="min-h-screen mt-16">
      

      {/* HERO */}
      <HeroCarousel images={imagesLink} contents={carouselContent} />
      {/* SEO H1 + SHORT INTRO */}
      <section className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Events, Party, Wedding & Birthday Rental Services in {cityName}
        </h1>

        <p className="mt-5 text-gray-600 leading-relaxed text-sm md:text-base">
          {locationProfile?.customIntro
            ? locationProfile.customIntro
            : `Book trusted rental services in ${cityName}${
                subAreas.length > 0
                  ? ` including ${subAreas
                      .slice(0, 3)
                      .map((a) => a.name)
                      .join(", ")}`
                  : ""
              }. Explore ${totalServices}+ verified service options with transparent pricing and professional event support.`}
        </p>

        {/* Optional intelligence layer */}
        {(locationProfile?.demandLevel === "high" ||
          locationProfile?.expressAvailable) && (
          <div className="mt-6 text-xs uppercase tracking-wider text-gray-500 space-y-1">
            {locationProfile?.demandLevel === "high" && (
              <div>
                {cityName} is currently experiencing strong rental demand.
              </div>
            )}
            {locationProfile?.expressAvailable && (
              <div>Fast fulfillment and priority delivery available.</div>
            )}
          </div>
        )}
      </section>

      {/* FEATURED */}
      <Servicecards
        data={featured}
        title={`Featured Rental Services in ${cityName}`}
        subtitle={`Handpicked decoration and event rental services trusted by customers in ${cityName}.`}
        citySlug={slug}
      />

      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="md:text-xl text-base inline-block font-semibold text-gray-900 border-b-4 border-[#003459] pb-2 ">
              Rental Products in {cityName}
            </h2>

            <Link
              href={`/${slug}/products`}
              className="text-sm font-medium text-gray-900 flex items-center gap-1 hover:gap-2 transition-all"
            >
              View More →
            </Link>
          </div>

          {/* 🔥 MOBILE: HORIZONTAL SCROLL */}
          <div className="relative sm:hidden">
            {/* fade effect (scroll hint 🔥) */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {products.slice(0, 8).map((product) => (
                <div key={product._id} className="min-w-[75%]">
                  <ProductCard product={product} citySlug={slug} />
                </div>
              ))}
            </div>
          </div>

          {/* 💻 DESKTOP: GRID */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                citySlug={slug}
              />
            ))}
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      <Services
        city={cityName}
        subAreas={subAreas}
        totalServices={totalServices}
        seasonalNote={locationProfile?.seasonalNote || null}
        deliveryNote={locationProfile?.deliveryNote || null}
        trendingText={locationProfile?.trendingText || null}
        expressAvailable={locationProfile?.expressAvailable || false}
        demandLevel={locationProfile?.demandLevel || null}
      />
      {/* PRODUCT CATEGORIES */}
      {/* <ProductCategories categories={categories} citySlug={slug} /> */}

      {locationProfile?.faq?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-semibold mb-6">
            Frequently Asked Questions in {cityName}
          </h2>

          <div className="space-y-4">
            {locationProfile?.faq?.map((faq, i) => (
              <details
                key={i}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer"
              >
                <summary className="font-medium text-gray-900">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* TOP BOOKED */}
      {/* <Servicecards
        data={top}
        title={`Most Booked Services in ${cityName}`}
        subtitle={`Our top-performing and highest-rated rental packages available across ${cityName}.`}
        citySlug={slug}
      /> */}

      {/* PREMIUM */}
      {/* <Servicecards
        data={best}
        title={`Premium & Luxury Rentals in ${cityName}`}
        subtitle={`Exclusive high-end event setups for weddings, corporate events, and special occasions in ${cityName}.`}
        citySlug={slug}
      /> */}

      {vendors.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          {/* HEADER (MATCH PRODUCTS STYLE) */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Trusted Vendors in {cityName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Verified professionals for your event needs
            </p>
          </div>

          {/* 🔥 MOBILE: HORIZONTAL SCROLL (CONSISTENT UX) */}
          <div className="relative sm:hidden">
            {/* scroll hint */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {vendors.slice(0, 8).map((vendor) => (
                <div key={vendor._id} className="min-w-[75%]">
                  <VendorCard vendor={vendor} citySlug={slug} />
                </div>
              ))}
            </div>
          </div>

          {/* 💻 DESKTOP GRID */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendors.slice(0, 8).map((vendor) => (
              <VendorCard key={vendor._id} vendor={vendor} citySlug={slug} />
            ))}
          </div>
        </section>
      )}

      <ServiceCategories categories={serviceCategories} citySlug={slug} />

      <RelatedBlogs
        title="Wedding & Event Planning Guides"
        subtitle="Explore helpful articles to plan your event smarter."
      />

      {/* SUB AREAS FOOTER BLOCK */}
      {subAreas.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold mb-4">
            Serving Areas in {cityName}
          </h2>
          <div className="flex flex-wrap gap-3">
            {subAreas.map((area) => (
              <span
                key={area._id}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700"
              >
                {area.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
    </>
  );
}
