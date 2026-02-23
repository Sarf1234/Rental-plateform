import ProductCards from "@/components/ui/public/ProductCards";
import { apiRequest } from "@/lib/api";

export const revalidate = 3600;

/* =====================================
   ✅ DYNAMIC SEO METADATA (FINAL FIX)
===================================== */
export async function generateMetadata({ params }) {
  const { slug, categorySlug } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://kiraynow.com";

  try {
    /* 🔹 Fetch Category SEO (Admin Controlled) */
    const categoryRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/categories/${categorySlug}`
    );

    const category = categoryRes?.data;
    const categorySEO = category?.seo || {};

    /* 🔹 Fetch City (Optional for name clarity) */
    const cityRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?city=${slug}&category=${categorySlug}&page=1&limit=1`
    );

    const city = cityRes?.city;

    const cityName = city?.name || slug;
    const categoryName = category?.name || categorySlug;

    const canonicalUrl =
      categorySEO?.canonicalUrl ||
      `${baseUrl}/${slug}/categories/${categorySlug}`;

    /* 🔥 ADMIN CONTROLLED INDEX */
    const shouldIndex = categorySEO?.noIndex ? false : true;

    return {
      metadataBase: new URL(baseUrl),

      title:
        categorySEO?.metaTitle ||
        `${categoryName} Rental in ${cityName}`,

      description:
        categorySEO?.metaDescription ||
        `Rent ${categoryName.toLowerCase()} in ${cityName} at affordable pricing. Verified vendors and professional setup available.`,

      keywords: categorySEO?.metaKeywords || [],

      alternates: {
        canonical: canonicalUrl,
      },

      robots: {
        index: shouldIndex,
        follow: true,
      },

      openGraph: {
        title:
          categorySEO?.metaTitle ||
          `${categoryName} Rental in ${cityName}`,
        description:
          categorySEO?.metaDescription ||
          `Browse ${categoryName.toLowerCase()} rental services in ${cityName}.`,
        url: canonicalUrl,
        siteName: "KirayNow",
        type: "website",
        locale: "en_IN",
      },

      twitter: {
        card: "summary_large_image",
        title:
          categorySEO?.metaTitle ||
          `${categoryName} Rental in ${cityName}`,
        description:
          categorySEO?.metaDescription ||
          `Affordable ${categoryName.toLowerCase()} rental in ${cityName}.`,
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {};
  }
}

/* =====================================
   ✅ CATEGORY PAGE COMPONENT
===================================== */
export default async function CategoryPage({ params }) {
  const { slug, categorySlug } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://kiraynow.com";

  let products = [];
  let cityName = slug;
  let categoryName = categorySlug;

  try {
    /* 🔹 Fetch Products */
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?city=${slug}&category=${categorySlug}&page=1&limit=12`
    );

    products = res?.data || [];

    if (res?.city?.name) {
      cityName = res.city.name;
    }

  } catch (err) {
    console.error("Category Page Error:", err);
  }

  categoryName = categorySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const categoryUrl = `${baseUrl}/${slug}/categories/${categorySlug}`;

  /* =====================================
     STRUCTURED DATA
  ===================================== */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Rental in ${cityName}`,
    url: categoryUrl,
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