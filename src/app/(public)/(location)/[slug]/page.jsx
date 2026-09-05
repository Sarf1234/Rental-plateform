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

export const revalidate = 86400;
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`
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

  let banners = [];

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
      bannerRes,
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

      apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/banners?placement=citypage&city=${slug}`
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

    banners =
      bannerRes?.data || [];
  } catch (err) {
    console.error(
      "Parallel fetch failed:",
      err
    );
  }

  if (!cityData) {
    return (
      <div className="mt-20 text-center">
        City not found
      </div>
    );
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
          "query-input":
            "required name=search_term_string",
        },
      },

      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "KirayNow",
        url: baseUrl,

        logo:
          "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",

        description:
          "KirayNow is a trusted event rental marketplace offering wedding decoration, birthday setup, party rentals and event services across multiple cities in India.",

        contactPoint: {
          "@type": "ContactPoint",

          telephone:
            cityData?.footer?.phone ||
            "+91-7672876321",

          contactType: "customer support",

          areaServed: "IN",

          availableLanguage: [
            "English",
            "Hindi",
          ],
        },
      },

      {
        "@type": "WebPage",

        "@id": `${baseUrl}/${slug}#webpage`,

        url: `${baseUrl}/${slug}`,

        name:
          locationProfile?.seoTitleOverride ||
          `Event Rentals in ${cityName}`,

        description:
          locationProfile?.seoDescriptionOverride ||
          `Book wedding decoration, birthday setup and rental services in ${cityName}.`,

        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },

        about: {
          "@id": `${baseUrl}/${slug}#localbusiness`,
        },
      },

      {
        "@type": "LocalBusiness",

        "@id":
          `${baseUrl}/${slug}#localbusiness`,

        name:
          `KirayNow ${cityName}`,

        url:
          `${baseUrl}/${slug}`,

        image:
          "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",

        description:
          locationProfile?.seoDescriptionOverride ||
          `Event rental and wedding setup services in ${cityName}.`,

        telephone:
          cityData?.footer?.phone ||
          "+91-7672876321",

        address: {
          "@type": "PostalAddress",

          addressLocality:
            cityName,

          addressRegion:
            cityData?.state,

          addressCountry: "IN",
        },

        areaServed: {
          "@type": "City",

          name: cityName,
        },

        priceRange: "₹₹",
      },

      {
        "@type": "Service",

        "@id": `${baseUrl}/${slug}#service`,

        name:
          locationProfile?.seoTitleOverride ||
          `Event Rental & Wedding Services in ${cityName}`,

        provider: {
          "@id": `${baseUrl}/#organization`,
        },

        areaServed: {
          "@type": "City",

          name: cityName,
        },

        serviceArea:
          subAreas
            ?.slice(0, 5)
            ?.map((area) => ({
              "@type": "Place",
              name: area.name,
            })),

        url: `${baseUrl}/${slug}`,

        image:
          "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
      },

      {
        "@type": "BreadcrumbList",

        "@id":
          `${baseUrl}/${slug}#breadcrumb`,

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

            item:
              `${baseUrl}/${slug}`,
          },
        ],
      },

      ...(locationProfile?.faq?.length > 0
        ? [
            {
              "@type": "FAQPage",

              "@id":
                `${baseUrl}/${slug}#faq`,

              mainEntity:
                locationProfile?.faq?.map(
                  (faq) => ({
                    "@type": "Question",

                    name:
                      faq.question,

                    acceptedAnswer: {
                      "@type": "Answer",
                      text:
                        faq.answer,
                    },
                  })
                ),
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
          __html:
            JSON.stringify(
              structuredData
            ),
        }}
      />

      <div className="min-h-screen md:mt-16 mt-15">

        <ProductCategories citySlug={slug} />

        {/* HERO */}
        <HeroCarousel
          banners={banners}
        />

        {/* SEO H1 + SHORT INTRO */}

        {locationProfile?.additionalContent && (
          <section
            className="
              max-w-5xl
              mx-auto
              px-4
              sm:px-5
              md:px-6

              py-8
              sm:py-10
              md:py-14
            "
          >
            <div className="prose max-w-none">

              <h2
                className="
                  text-xl
                  sm:text-2xl
                  md:text-3xl
                  font-semibold
                  leading-[1.25]
                "
              >
                Event Planning & Rental Services in{" "}
                {cityName}
              </h2>

              <div
                className="
                  mt-3
                  sm:mt-4

                  text-xs
                  sm:text-sm
                  md:text-base

                  leading-5
                  md:leading-6

                  text-gray-700
                  whitespace-pre-line
                "
              >
                {locationProfile.additionalContent}
              </div>

            </div>
          </section>
        )}

        {/* PRODUCTS */}

        {products.length > 0 && (
          <section
            className="
              max-w-7xl
              mx-auto

              px-4
              sm:px-5
              md:px-6

              py-8
              sm:py-10
              md:py-12
            "
          >

            {/* HEADER */}

            <div
              className="
                mb-4
                sm:mb-5
                md:mb-6

                flex
                items-center
                justify-between

                gap-3
              "
            >

              <h2
                className="
                  md:text-xl
                  text-base
                  sm:text-lg

                  inline-block
                  font-semibold
                  text-gray-900

                  border-b-4
                  border-[#003459]

                  pb-1.5
                  sm:pb-2

                  leading-[1.25]
                "
              >
                Rental Products in{" "}
                {cityName}
              </h2>

              <Link
                href={`/${slug}/products`}
                className="
                  text-xs
                  sm:text-sm

                  font-medium
                  text-gray-900

                  flex
                  items-center
                  gap-1

                  hover:gap-2
                  transition-all

                  whitespace-nowrap
                "
              >
                View More →
              </Link>

            </div>

            {/* MOBILE */}

            <div className="relative sm:hidden">

              <div
                className="
                  pointer-events-none
                  absolute
                  right-0
                  top-0
                  h-full
                  w-10

                  bg-gradient-to-l
                  from-white
                  to-transparent

                  z-10
                "
              />

              <div
                className="
                  flex
                  gap-3
                  overflow-x-auto
                  pb-2
                  scrollbar-hide
                "
              >
                {products
                  .slice(0, 8)
                  .map((product) => (
                    <div
                      key={product._id}
                      className="min-w-[68%]"
                    >
                      <ProductCard
                        product={product}
                        citySlug={slug}
                      />
                    </div>
                  ))}
              </div>

            </div>

            {/* DESKTOP */}

            <div
              className="
                hidden
                sm:grid

                sm:grid-cols-2
                lg:grid-cols-4

                gap-4
                md:gap-5
                lg:gap-6
              "
            >
              {products
                .slice(0, 8)
                .map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    citySlug={slug}
                  />
                ))}
            </div>

          </section>
        )}

        {/* FEATURED */}

        <Servicecards
          data={featured}
          title={`Featured Rental Services in ${cityName}`}
          subtitle={`Handpicked decoration and event rental services trusted by customers in ${cityName}.`}
          citySlug={slug}
        />

        {/* WHY CHOOSE US */}

        <Services
          city={cityName}
          subAreas={subAreas}
          totalServices={totalServices}
          seasonalNote={
            locationProfile?.seasonalNote ||
            null
          }
          deliveryNote={
            locationProfile?.deliveryNote ||
            null
          }
          trendingText={
            locationProfile?.trendingText ||
            null
          }
          expressAvailable={
            locationProfile?.expressAvailable ||
            false
          }
          demandLevel={
            locationProfile?.demandLevel ||
            null
          }
        />

        {/* PRODUCT CATEGORIES */}
        {/* <ProductCategories categories={categories} citySlug={slug} /> */}

        {/* FAQ */}

        {locationProfile?.faq?.length > 0 && (
          <section
            className="
              max-w-7xl
              mx-auto

              px-4
              sm:px-5
              md:px-6

              py-8
              sm:py-10
              md:py-12
            "
          >

            <h2
              className="
                text-xl
                sm:text-2xl

                font-semibold
                leading-[1.25]

                mb-4
                sm:mb-5
                md:mb-6
              "
            >
              Frequently Asked Questions in{" "}
              {cityName}
            </h2>

            <div
              className="
                space-y-3
                sm:space-y-4
              "
            >
              {locationProfile?.faq?.map(
                (faq, i) => (
                  <details
                    key={i}
                    className="
                      border
                      border-gray-200
                      rounded-lg

                      p-3
                      sm:p-4

                      cursor-pointer
                    "
                  >
                    <summary
                      className="
                        text-sm
                        sm:text-base

                        font-medium
                        leading-5
                        sm:leading-6

                        text-gray-900
                      "
                    >
                      {faq.question}
                    </summary>

                    <p
                      className="
                        mt-2

                        text-xs
                        sm:text-sm
                        md:text-sm

                        text-gray-600

                        leading-5
                        sm:leading-6
                      "
                    >
                      {faq.answer}
                    </p>
                  </details>
                )
              )}
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

        {/* VENDORS */}

        {vendors.length > 0 && (
          <section
            className="
              max-w-7xl
              mx-auto

              px-4
              sm:px-5
              md:px-6

              py-8
              sm:py-10
              md:py-12
            "
          >

            {/* HEADER */}

            <div
              className="
                mb-4
                sm:mb-5
                md:mb-6
              "
            >
              <h2
                className="
                  text-xl
                  sm:text-2xl

                  font-semibold
                  leading-[1.25]

                  text-gray-900
                "
              >
                Trusted Vendors in{" "}
                {cityName}
              </h2>

              <p
                className="
                  text-xs
                  sm:text-sm
                  md:text-base

                  text-gray-500

                  mt-1
                  sm:mt-1.5

                  leading-5
                  md:leading-6
                "
              >
                Verified professionals for your event needs
              </p>
            </div>

            {/* MOBILE */}

            <div className="relative sm:hidden">

              <div
                className="
                  pointer-events-none
                  absolute
                  right-0
                  top-0
                  h-full
                  w-10

                  bg-gradient-to-l
                  from-white
                  to-transparent

                  z-10
                "
              />

              <div
                className="
                  flex
                  gap-3
                  overflow-x-auto
                  pb-2
                  scrollbar-hide
                "
              >
                {vendors
                  .slice(0, 8)
                  .map((vendor) => (
                    <div
                      key={vendor._id}
                      className="min-w-[78%]"
                    >
                      <VendorCard
                        vendor={vendor}
                        citySlug={slug}
                      />
                    </div>
                  ))}
              </div>

            </div>

            {/* DESKTOP */}

            <div
              className="
                hidden
                sm:grid

                sm:grid-cols-2
                lg:grid-cols-4

                gap-4
                md:gap-5
                lg:gap-6
              "
            >
              {vendors
                .slice(0, 8)
                .map((vendor) => (
                  <VendorCard
                    key={vendor._id}
                    vendor={vendor}
                    citySlug={slug}
                  />
                ))}
            </div>

          </section>
        )}

        <ServiceCategories
          categories={serviceCategories}
          citySlug={slug}
        />

        {/* SUB AREAS */}

        {subAreas.length > 0 && (
          <section
            className="
              max-w-7xl
              mx-auto

              px-4
              sm:px-5
              md:px-6

              py-8
              sm:py-9
              md:py-10
            "
          >

            <h2
              className="
                text-xl
                sm:text-2xl

                font-semibold
                leading-[1.25]

                mb-3
                sm:mb-4
              "
            >
              Serving Areas in{" "}
              {cityName}
            </h2>

            <div
              className="
                flex
                flex-wrap

                gap-2
                sm:gap-3
              "
            >
              {subAreas.map((area) => (
                <span
                  key={area._id}
                  className="
                    px-3
                    sm:px-4

                    py-1.5
                    sm:py-2

                    bg-gray-100
                    rounded-full

                    text-xs
                    sm:text-sm

                    leading-5

                    text-gray-700
                  "
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