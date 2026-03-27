import Services from "@/components/layout/Services";
import { imagesLink, carouselContent } from "../../../../../utils/seedData";
import HeroCarousel from "@/components/layout/HeroCrousel";
import { apiRequest } from "@/lib/api";
import FlagsCards from "@/components/ui/public/FlagsCards";
import ProductCategories from "@/components/ui/public/ProductCategories";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kiraynow.com";

    const cityRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`,
      { next: { revalidate: 3600 } },
    );

    const cityData = await cityRes.json();
    const city = cityData?.data;

    if (!city) {
      return {
        title: "City Not Found",
        robots: { index: false, follow: false },
      };
    }

    const cityName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const brandName = "KirayNow"; // replace later

    const title = `Rental Products in ${cityName} | Event Items on Rent | ${brandName}`;

    const description = `Explore premium rental products in ${cityName} including event furniture, lighting, sound systems, decor items and more. Affordable pricing and verified providers available across ${
      city?.subAreas?.length
        ? city.subAreas
            .slice(0, 3)
            .map((a) => a.name)
            .join(", ")
        : cityName
    }.`;

    const url = `${baseUrl}/${slug}/products`;

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
        type: "website",
        images: [
          {
            url: "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp", // replace later
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [
          "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
        ],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: "Rental Products",
      description: "Event rental products available.",
    };
  }
}

export default async function CityProductsPage({ params }) {
  const { slug } = await params;

  let featured = [];
  let top = [];
  let best = [];
  let all = [];
  let newProduct = [];
  let cityData = null;
  let categories = [];
  let locationContext = null;

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
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?city=${slug}&page=1&limit=10`,
    );

    featured = res?.featured || [];
    top = res?.top || [];
    best = res?.best || [];
    all = res?.all || [];
    newProduct = res?.new || [];
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  try {
    const cityRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`,
    );
    cityData = cityRes?.data || null;
    locationContext = cityRes?.locationContext;
  } catch (err) {
    console.log(locationContext);
    console.error("Failed to fetch city:", err);
  }

  // Proper city formatting (supports multi-word slugs)
  const cityName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const totalProducts = all?.data?.length;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kiraynow.com";

  const productUrl = `${baseUrl}/${slug}/products`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "KirayNow",
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },

      // 🔹 Organization (Marketplace Platform)
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "KirayNow",
        logo: "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
        url: baseUrl,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-7672876321",
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      },

      // 🔹 Breadcrumb
      {
        "@type": "BreadcrumbList",
        "@id": `${productUrl}#breadcrumb`,
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
            name: "Rental Products",
            item: productUrl,
          },
        ],
      },

      // 🔹 Collection Page
      {
        "@type": "CollectionPage",
        "@id": productUrl,
        name: `Rental Products in ${cityName}`,
        description: `Explore premium rental products in ${cityName} including furniture, lighting, decor and more.`,
        url: productUrl,
        isPartOf: {
          "@id": `${baseUrl}#website`,
        },
      },

      // 🔹 Categories List
      {
        "@type": "ItemList",
        name: `Product Categories in ${cityName}`,
        itemListElement: categories.slice(0, 10).map((cat, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/${slug}/category/${cat.slug}`,
          name: cat.name,
        })),
      },

      // 🔹 ItemList (All Products)
      {
        "@type": "ItemList",
        name: `Rental Products in ${cityName}`,
        itemListElement: all?.data.slice(0, 20).map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/${slug}/products/${product.slug}`,
          name: product.name,
        })),
      },

      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What rental products are available in ${cityName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `You can rent event furniture, lighting, decor items and more in ${cityName} through KirayNow.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen mt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* HERO */}
      <HeroCarousel images={imagesLink} contents={carouselContent} />

      {/* 🔹 SEO H1 + INTRO */}
      <section className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Rental Products in {cityName}
        </h1>

        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          {locationContext?.customIntro ||
            `Explore ${totalProducts}+ rental products in ${cityName} including chairs, tables, tents, lighting and decor for weddings, parties and corporate events.`}
        </p>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <FlagsCards
          data={featured}
          title={`Featured Rental Products in ${cityName}`}
          citySlug={slug}
        />
      )}

      {(locationContext?.seasonalNote || locationContext?.deliveryNote) && (
        <section className="max-w-7xl mx-auto px-4 py-10 text-center">
          <h2 className="text-xl md:text-3xl md:font-bold text-gray-900 mb-3">
            Rental Demand in {cityName}
          </h2>

          {locationContext?.seasonalNote && (
            <p className="mb-2  text-gray-600 max-w-3xl mx-auto">
              {locationContext.seasonalNote}
            </p>
          )}

          {locationContext?.deliveryNote && (
            <p className=" text-gray-600 max-w-3xl mx-auto">
              {locationContext.deliveryNote}
            </p>
          )}
        </section>
      )}

      <ProductCategories categories={categories} citySlug={slug} />

      {/* WHY SECTION */}
      <Services
        city={cityName}
        subAreas={cityData?.subAreas || []}
        totalServices={20}
      />

      {/* TOP */}
      {top.length > 0 && (
        <FlagsCards
          data={top}
          title={`Most Booked Products in ${cityName}`}
          citySlug={slug}
        />
      )}

      {/* BEST */}
      {best.length > 0 && (
        <FlagsCards
          data={best}
          title={`Premium Rental Products in ${cityName}`}
          citySlug={slug}
        />
      )}

      {/* NEW */}
      {newProduct.length > 0 && (
        <FlagsCards
          data={newProduct}
          title={`New Rental Products in ${cityName}`}
          citySlug={slug}
        />
      )}

      {/* EMPTY STATE */}
      {totalProducts === 0 && (
        <div className="text-center py-12 text-gray-500">
          No rental products available in {cityName} yet.
        </div>
      )}
      {(locationContext?.trendingText || locationContext?.demandLevel) && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-gradient-to-br from-gray-50 to-white border rounded-2xl shadow-sm p-6 md:p-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Delivery & Availability in {cityName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Real-time rental insights for your area
                </p>
              </div>

              {/* DEMAND BADGE */}
              {locationContext?.demandLevel && (
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full w-fit ${
                    locationContext.demandLevel === "high"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  🔥{" "}
                  {locationContext.demandLevel === "high"
                    ? "High Demand"
                    : locationContext.demandLevel}
                </span>
              )}
            </div>

            {/* MAIN CONTENT */}
            {locationContext?.trendingText && (
              <p className="text-gray-700 leading-relaxed">
                {locationContext.trendingText}
              </p>
            )}

            {/* EXPRESS DELIVERY */}
            {locationContext?.expressAvailable && (
              <div className="mt-5 flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-medium">
                  Express delivery available in selected areas
                </span>
              </div>
            )}

            {/* MICRO CTA (VERY IMPORTANT 🔥) */}
            {/* <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition">
          Explore Products
        </button>

        <button className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 transition">
          Contact Vendors
        </button>
      </div> */}
          </div>
        </section>
      )}
    </div>
  );
}
