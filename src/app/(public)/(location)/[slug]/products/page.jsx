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
  } catch (err) {
    console.error("Failed to fetch city:", err);
  }

  // Proper city formatting (supports multi-word slugs)
  const cityName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const totalProducts = all.length;

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
          telephone: "+91-8839931558",
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
      <section className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Rental Products in {cityName}
        </h1>

        <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
          Explore {totalProducts}+ rental products available in {cityName}. From
          event furniture and lighting to sound systems and decor, find reliable
          and affordable rental options for your celebration.
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
    </div>
  );
}
