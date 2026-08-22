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

  <div className="pointer-events-none absolute inset-0">

    {/* Large soft circle */}

    <div className="
      absolute
      -right-24
      -top-24
      h-72
      w-72
      rounded-full
      bg-white/10
      blur-2xl
    " />

    {/* Bottom circle */}

    <div className="
      absolute
      -bottom-32
      left-1/3
      h-80
      w-80
      rounded-full
      bg-cyan-300/10
      blur-3xl
    " />

    {/* Small decorative circle */}

    <div className="
      absolute
      right-[18%]
      bottom-10
      h-20
      w-20
      rounded-full
      border
      border-white/10
    " />

  </div>


  {/* =================================================
      CONTENT
  ================================================= */}

  <div className="
    relative
    mx-auto
    max-w-7xl
    px-4
    py-5
    md:py-5
  ">

    <div className="max-w-3xl">

      {/* BRAND LABEL */}

      <div className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-white/20
        bg-white/10
        px-3
        py-1
        backdrop-blur-sm
      ">

        <span className="
          h-2
          w-2
          rounded-full
          bg-cyan-300
        " />

        <span className="
          text-xs
          font-semibold
          uppercase
          tracking-wider
          text-white
        ">
          KirayNow Rental Marketplace
        </span>

      </div>


      {/* HEADING */}

      <h1 className="
        mt-5
        text-3xl
        font-bold
        leading-tight
        tracking-tight
        text-white
        sm:text-4xl
        md:text-5xl
      ">
        All Rental Products
        <span className="block text-cyan-200">
          in {cityName}
        </span>
      </h1>


      {/* DESCRIPTION */}

      <p className="
        mt-4
        max-w-2xl
        text-sm
        leading-7
        text-white/80
        sm:text-base
      ">
        Browse all rental products available in{" "}
        <span className="font-semibold text-white">
          {cityName}
        </span>
        , including chairs, tables, event furniture,
        LED screens, lighting, decor and other event
        rental equipment.
      </p>


      {/* QUICK BENEFITS */}

      <div className="
        mt-6
        flex
        flex-wrap
        gap-2
      ">

        <span className="
          rounded-full
          border
          border-white/15
          bg-white/10
          px-3
          py-1.5
          text-xs
          font-medium
          text-white/90
          backdrop-blur-sm
        ">
          ✓ Wide Product Range
        </span>

        <span className="
          rounded-full
          border
          border-white/15
          bg-white/10
          px-3
          py-1.5
          text-xs
          font-medium
          text-white/90
          backdrop-blur-sm
        ">
          ✓ Local Rental Options
        </span>

        <span className="
          rounded-full
          border
          border-white/15
          bg-white/10
          px-3
          py-1.5
          text-xs
          font-medium
          text-white/90
          backdrop-blur-sm
        ">
          ✓ Easy Enquiry
        </span>

      </div>

    </div>

  </div>

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