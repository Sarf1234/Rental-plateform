import Services from "@/components/layout/Services";
import { imagesLink, carouselContent } from "../../../../utils/seedData";
import HeroCarousel from "@/components/layout/HeroCrousel";
import Servicecards from "@/components/ui/public/Servicecards";
import { apiRequest } from "@/lib/api";
import ProductCategories from "@/components/ui/public/ProductCategories";
import RelatedBlogs from "@/components/layout/RelatedBlogs";
import ServiceCategories from "@/components/ui/public/ServiceCategories";

export const revalidate = 3600; // ISR (1 hour)

// 🔥 Dynamic Metadata Generator
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const cityRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`,
    );

    const city = cityRes?.data;
    if (!city) return {};

    const subAreasText =
      city.subAreas
        ?.slice(0, 2)
        .map((a) => a.name)
        .join(", ") || "";

    const title = `Affordable Birthday, Wedding & Party Rentals in ${city.name} | KirayNow`;
    const description = `Planning a celebration in ${city.name}? KirayNow helps you book trusted birthday decoration, wedding setups and party rental services${
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

  const baseUrl = "https://kiraynow.com";

  let featured = [];
  let top = [];
  let best = [];
  let all = [];
  let categories = [];
  let cityData = null;

  let serviceCategories = [];

  try {
    const serviceCatRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`,
    );
    serviceCategories = serviceCatRes?.data || [];
  } catch (err) {
    console.error("Failed to fetch service categories:", err);
  }

  try {
    const cityRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`,
    );
    cityData = cityRes?.data || null;
  } catch (err) {
    console.error("Failed to fetch city:", err);
  }

  try {
    const catRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/categories`,
    );
    categories = catRes?.data || [];
  } catch (err) {
    console.error("Failed to fetch product categories:", err);
  }

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/service?city=${slug}&page=1&limit=10`,
    );

    featured = res.featured || [];
    top = res.top || [];
    best = res.best || [];
    all = res.all || [];
  } catch (err) {
    console.error("Failed to fetch services:", err);
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
          telephone: "+91-8839931558",
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

      // 🔹 FAQ
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What are the best rental services available in ${cityName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `We provide wedding decoration, tent house, catering, lighting and complete event rental services across ${cityName}.`,
            },
          },
          {
            "@type": "Question",
            name: `How much does event rental cost in ${cityName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Pricing depends on event size and package. Basic packages start from ₹10,000 and premium setups go higher.`,
            },
          },
        ],
      },
    ],
  };

  // =========================
  // 🔥 SCHEMA SECTION END
  // =========================

  return (
    <div className="min-h-screen mt-16">
      {/* 🔥 JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* HERO */}
      <HeroCarousel images={imagesLink} contents={carouselContent} />
      {/* SEO H1 + SHORT INTRO */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl text-center md:text-3xl font-bold text-gray-900">
          Birthday, Wedding & Party Rental Services in {cityName}
        </h1>
        <p className="mt-3 text-gray-600 text-center m-auto max-w-3xl">
          Book trusted rental services in {cityName}
          {subAreas.length > 0 && (
            <>
              {" "}
              including{" "}
              {subAreas.slice(0, 3).map((area, i) => (
                <span key={area._id}>
                  {area.name}
                  {i < Math.min(2, subAreas.length - 1) ? ", " : ""}
                </span>
              ))}
            </>
          )}
          . Explore {totalServices}+ verified service options with transparent
          pricing and professional event support.
        </p>
      </section>

      {/* FEATURED */}
      <Servicecards
        data={featured}
        title={`Featured Rental Services in ${cityName}`}
        subtitle={`Handpicked decoration and event rental services trusted by customers in ${cityName}.`}
        citySlug={slug}
      />

      {/* WHY CHOOSE US */}
      <Services city={cityName} subAreas={subAreas} totalServices={10} />

      {/* PRODUCT CATEGORIES */}
      {/* <ProductCategories categories={categories} citySlug={slug} /> */}

      {/* TOP BOOKED */}
      <Servicecards
        data={top}
        title={`Most Booked Services in ${cityName}`}
        subtitle={`Our top-performing and highest-rated rental packages available across ${cityName}.`}
        citySlug={slug}
      />

      {/* PREMIUM */}
      <Servicecards
        data={best}
        title={`Premium & Luxury Rentals in ${cityName}`}
        subtitle={`Exclusive high-end event setups for weddings, corporate events, and special occasions in ${cityName}.`}
        citySlug={slug}
      />

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
  );
}
