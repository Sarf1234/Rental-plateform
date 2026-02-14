import ProductCards from "@/components/ui/public/ProductCards";
import { apiRequest } from "@/lib/api";

export const revalidate = 3600;

/* ==========================
   Dynamic SEO Metadata
========================== */
export async function generateMetadata({ params }) {
  const { slug, categorySlug } = await params;

  const baseUrl = "https://kiraynow.com";

  const cityName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const categoryName = categorySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const title = `${categoryName} Rental in ${cityName} | KirayNow`;

  const description = `Rent ${categoryName.toLowerCase()} in ${cityName} at affordable pricing. Verified vendors, fast delivery and professional event setup available across the city.`;

  const canonicalUrl = `${baseUrl}/city/${slug}/categories/${categorySlug}`;

  const ogImage =
    "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp";

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "KirayNow",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${categoryName} rental in ${cityName}`,
        },
      ],
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
}

/* ==========================
   CATEGORY PAGE
========================== */
export default async function CategoryPage({ params }) {
  const { slug, categorySlug } = await params;

  const baseUrl = "https://kiraynow.com";

  let products = [];

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?city=${slug}&category=${categorySlug}&page=1&limit=12`
    );

    products = res?.data || [];
  } catch (err) {
    console.error("Category Page Error:", err);
  }

  const cityName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const categoryName = categorySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const categoryUrl = `${baseUrl}/city/${slug}/categories/${categorySlug}`;

  /* ==========================
     STRUCTURED DATA
  ========================== */

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "KirayNow",
      },

      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "KirayNow",
        url: baseUrl,
        logo: "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-8839931558",
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      },

      {
        "@type": "BreadcrumbList",
        "@id": `${categoryUrl}#breadcrumb`,
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
            item: `${baseUrl}/city/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: categoryName,
            item: categoryUrl,
          },
        ],
      },

      {
        "@type": "CollectionPage",
        "@id": categoryUrl,
        name: `${categoryName} Rental in ${cityName}`,
        description: `Browse ${categoryName.toLowerCase()} rental products in ${cityName}. Affordable pricing and verified vendors available.`,
        url: categoryUrl,
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
      },

      {
        "@type": "ItemList",
        name: `${categoryName} Rental Products in ${cityName}`,
        itemListElement: products.slice(0, 20).map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/city/${slug}/products/${product.slug}`,
          name: product.title,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen mt-16 max-w-7xl mx-auto px-4 py-10">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* PAGE HEADING */}
      <div className="mb-10">
        <h1 className="text-3xl text-center font-bold capitalize">
          {categoryName} Rental in {cityName}
        </h1>

        <p className="text-gray-600 mt-2 m-auto text-center max-w-3xl">
          Explore premium {categoryName.toLowerCase()} rental products in{" "}
          {cityName}. Transparent pricing, verified suppliers and professional
          event support to make your celebration smooth and stress-free.
        </p>
      </div>

      {/* PRODUCTS GRID */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCards
              key={product._id}
              product={product}
              citySlug={slug}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 py-20 text-center">
          No products found in this category.
        </div>
      )}
    </div>
  );
}
