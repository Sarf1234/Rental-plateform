import { apiRequest } from "@/lib/api";
import AllProductClient from "@/components/ui/public/AllProductClient";

export const revalidate = 78600;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const cityName = slug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  const title = `All Rental Products in ${cityName} | KirayNow`;

  const description = `Browse all rental products available in ${cityName}. Find chairs, tables, LED screens, furniture, decor and other event rental products on KirayNow.`;

  return {
    title,
    description,

    alternates: {
      canonical: `https://kiraynow.com/${slug}/all-product`,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url: `https://kiraynow.com/${slug}/all-product`,
      type: "website",
    },
  };
}

export default async function AllProductPage({ params }) {
  const { slug } = await params;

  let products = [];
  let pagination = {
    total: 0,
    page: 1,
    pages: 1,
    limit: 24,
  };

  let categories = [];
  let cityData = null;

  /* =========================================
     CITY
  ========================================= */

  try {
    const cityRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`
    );

    cityData = cityRes?.data || null;
  } catch (error) {
    console.error("Failed to fetch city:", error);
  }

  /* =========================================
     CATEGORIES
  ========================================= */

  try {
    const categoryRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/categories`
    );

    categories = categoryRes?.data || [];
  } catch (error) {
    console.error(
      "Failed to fetch product categories:",
      error
    );
  }

  /* =========================================
     INITIAL PRODUCTS
     
     sort is intentionally included.
     This makes the API enter SEARCH MODE.
  ========================================= */

  try {
    const productRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?city=${slug}&page=1&limit=100&sort=newest`
    );

    products = productRes?.data || [];

    pagination = productRes?.pagination || pagination;
  } catch (error) {
    console.error(
      "Failed to fetch all products:",
      error
    );
  }

  const cityName =
    cityData?.name ||
    city
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");

  /* =========================================
     STRUCTURED DATA
  ========================================= */

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://kiraynow.com";

  const pageUrl = `${baseUrl}/${slug}/all-product`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
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
            name: "All Rental Products",
            item: pageUrl,
          },
        ],
      },

      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        name: `All Rental Products in ${cityName}`,
        url: pageUrl,
        description: `Browse all rental products available in ${cityName}.`,
        numberOfItems: pagination.total,
      },

      {
        "@type": "ItemList",
        name: `Rental Products in ${cityName}`,
        numberOfItems: products.length,
        itemListElement: products
          .slice(0, 24)
          .map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${baseUrl}/${slug}/products/${product.slug}`,
            name:
              product.title ||
              product.name ||
              "Rental Product",
          })),
      },
    ],
  };

  return (
    <main className="min-h-screen mt-16">

      {/* STRUCTURED DATA */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* PAGE HEADER */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#003459] via-[#00527d] to-[#007ea7]">

  {/* =================================================
      BACKGROUND DECORATIONS
  ================================================= */}


</section>

      {/* CLIENT PRODUCT SYSTEM */}

      <AllProductClient
        citySlug={slug}
        cityName={cityName}
        initialProducts={products}
        initialPagination={pagination}
        categories={categories}
      />
    </main>
  );
}