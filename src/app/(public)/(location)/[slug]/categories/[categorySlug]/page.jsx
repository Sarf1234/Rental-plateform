import Link from "next/link";
import ProductCards from "@/components/ui/public/ProductCards";
import { apiRequest } from "@/lib/api";

export const revalidate = 3600;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kiraynow.com";

/* =====================================
   CATEGORY SHORT LABELS
===================================== */

const CATEGORY_LABELS = {
  "decor-styling": "Decor",
  "electronics-and-av-equipment": "Electronics",
  "fabrication-and-exhibition-stalls": "Fabrication",
  furniture: "Furniture",
  "lighting-equipment": "Lighting",
  "mandap-and-wedding": "Mandap",
  "sound-systems": "Sound",
  "special-effects": "Special Effects",
};

/* =====================================
   HELPER
===================================== */

function formatCityName(slug = "") {
  return slug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

/* =====================================
   DYNAMIC SEO METADATA
===================================== */

export async function generateMetadata({ params }) {
  const { slug, categorySlug } = await params;

  const baseUrl = SITE_URL;

  try {
    const categoryRes = await apiRequest(
      `${API_URL}/api/products/categories/${categorySlug}`
    );

    const category = categoryRes?.data;
    const categorySEO = category?.seo || {};

    const cityRes = await apiRequest(
      `${API_URL}/api/products?city=${slug}&category=${categorySlug}&page=1&limit=1`
    );

    const city = cityRes?.city;

    const cityName =
      city?.name || formatCityName(slug);

    const categoryName =
      category?.name ||
      formatCityName(categorySlug);

    const canonicalUrl =
      categorySEO?.canonicalUrl ||
      `${baseUrl}/${slug}/categories/${categorySlug}`;

    const shouldIndex = !categorySEO?.noIndex;

    const title =
      categorySEO?.metaTitle ||
      `${categoryName} Rental in ${cityName} | KirayNow`;

    const description =
      categorySEO?.metaDescription ||
      `Rent ${categoryName.toLowerCase()} in ${cityName} from trusted local vendors. Compare rental options, pricing and availability on KirayNow.`;

    return {
      metadataBase: new URL(baseUrl),

      title,
      description,

      keywords: categorySEO?.metaKeywords || [],

      alternates: {
        canonical: canonicalUrl,
      },

      robots: {
        index: shouldIndex,
        follow: true,
      },

      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "KirayNow",
        type: "website",
        locale: "en_IN",
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {};
  }
}

/* =====================================
   CATEGORY PAGE
===================================== */

export default async function CategoryPage({ params }) {
  const { slug, categorySlug } = await params;

  let products = [];
  let cityName = formatCityName(slug);
  let categoryName = formatCityName(categorySlug);

  try {
    const res = await apiRequest(
      `${API_URL}/api/products?city=${slug}&category=${categorySlug}&page=1&limit=12`
    );

    products = res?.data || [];

    if (res?.city?.name) {
      cityName = res.city.name;
    }
  } catch (error) {
    console.error("Category Page Error:", error);
  }

  /*
   * Convert category slug into readable name.
   * API category name is still preferred when available
   * elsewhere in the project.
   */
  categoryName = categorySlug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  const categoryShortName =
    CATEGORY_LABELS[categorySlug] ||
    categoryName.split(" ")[0];

  const categoryUrl =
    `${SITE_URL}/${slug}/categories/${categorySlug}`;

  /* =====================================
     STRUCTURED DATA
  ===================================== */

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Rental in ${cityName}`,
    url: categoryUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "KirayNow",
      url: SITE_URL,
    },
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-16">

      {/* =====================================
          JSON-LD
      ===================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* =====================================
          TOP UTILITY BAR
      ===================================== */}

      <div className="w-full bg-[#003459] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div
            className="
              min-h-[36px]
              flex
              items-center
              justify-between
              gap-4
              text-[11px]
              sm:text-xs
            "
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 min-w-0">
              <Link
                href={`/${slug}`}
                className="text-white/70 hover:text-white transition"
              >
                Home
              </Link>

              <span className="text-white/40">
                /
              </span>

              <Link
                href={`/${slug}/products`}
                className="text-white/70 hover:text-white transition"
              >
                Rentals
              </Link>

              <span className="text-white/40">
                /
              </span>

              <span className="font-medium truncate">
                {categoryShortName}
              </span>
            </div>

            {/* Utility info */}
            <div className="hidden sm:flex items-center gap-4 whitespace-nowrap">
              {/* <span className="text-white/75">
                📍 {cityName}
              </span>

              <span className="text-white/35">
                |
              </span> */}

              <span className="text-white/75">
                Fast local delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          CATEGORY NAVIGATION STRIP
      ===================================== */}

      <div className="w-full bg-white border-b border-gray-200">
  <div
    className="
      w-full

      overflow-x-auto
      overflow-y-hidden

      [scrollbar-width:none]
      [-ms-overflow-style:none]
      [&::-webkit-scrollbar]:hidden
    "
  >
    <div
      className="
        flex
        items-center

        w-full
        min-w-max

        gap-1

        px-3
        sm:px-4

        py-1.5
      "
    >
      {/* ALL RENTALS */}
      <Link
        href={`/${slug}/products`}
        className="
          flex
          flex-1
          items-center
          justify-center

          px-3
          py-2

          rounded-md

          text-xs
          sm:text-sm

          font-medium
          text-gray-500

          whitespace-nowrap

          hover:text-[#003459]
          hover:bg-gray-50

          transition
        "
      >
        All Rentals
      </Link>

      {Object.entries(CATEGORY_LABELS).map(
        ([categorySlugItem, label]) => {
          const isActive =
            categorySlugItem === categorySlug;

          return (
            <Link
              key={categorySlugItem}
              href={`/${slug}/categories/${categorySlugItem}`}
              className={`
                relative

                flex
                flex-1
                items-center
                justify-center

                px-3
                py-2

                rounded-md

                text-xs
                sm:text-sm

                font-medium

                whitespace-nowrap

                transition-all
                duration-200

                ${
                  isActive
                    ? "text-[#003459] bg-[#f1f7fa]"
                    : "text-gray-600 hover:text-[#003459] hover:bg-gray-50"
                }
              `}
            >
              {label}

              {isActive && (
                <span
                  className="
                    absolute
                    left-1/2
                    bottom-0

                    h-[2px]
                    w-6

                    -translate-x-1/2

                    rounded-full
                    bg-[#003459]
                  "
                />
              )}
            </Link>
          );
        }
      )}
    </div>
  </div>
</div>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="max-w-7xl mx-auto px-4">

        {/* =====================================
            HEADER
        ===================================== */}

        <section className="pt-4 md:pt-6 pb-6">
          <div className="max-w-4xl">

            <h1
              className="
                text-2xl
                sm:text-3xl
                md:text-4xl

                font-bold
                tracking-tight

                text-gray-900
              "
            >
              {categoryName} Rental in{" "}
              <span className="text-[#003459]">
                {cityName}
              </span>
            </h1>

            <p
              className="
                mt-3
                max-w-3xl

                text-sm
                md:text-base

                leading-6

                text-gray-600
              "
            >
              Browse {categoryName.toLowerCase()} rental
              products available in {cityName}. Compare
              options, pricing and availability from local
              rental providers.
            </p>

            {products.length > 0 && (
              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  text-xs
                  sm:text-sm
                  text-gray-500
                "
              >
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>

                <span>
                  rental options available
                </span>
              </div>
            )}
          </div>
        </section>

        {/* =====================================
            PRODUCT SECTION
        ===================================== */}

        {products.length > 0 ? (
          <section className="pb-10 md:pb-14">

            <div
              className="
                flex
                items-center
                justify-between
                mb-4
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    md:text-xl
                    font-semibold
                    text-gray-900
                  "
                >
                  {categoryShortName} Rentals
                </h2>

                <p className="mt-0.5 text-xs md:text-sm text-gray-500">
                  Available for rent in {cityName}
                </p>
              </div>
            </div>

            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4

                gap-3
                md:gap-5
              "
            >
              {products.map((product) => (
                <ProductCards
                  key={product._id}
                  product={product}
                  citySlug={slug}
                />
              ))}
            </div>
          </section>
        ) : (
          /* =====================================
             EMPTY STATE
          ===================================== */

          <section className="pb-16">
            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white

                px-5
                py-14
                md:py-20

                text-center
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-full
                  bg-gray-100

                  text-lg
                "
              >
                🔎
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                No rentals found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                We don't have {categoryShortName.toLowerCase()} rentals
                available in {cityName} yet.
              </p>

              <Link
                href={`/${slug}/products`}
                className="
                  inline-flex
                  items-center
                  justify-center

                  mt-5

                  rounded-lg

                  bg-[#003459]
                  px-5
                  py-2.5

                  text-sm
                  font-semibold
                  text-white

                  hover:bg-[#00263f]

                  transition
                "
              >
                Browse All Rentals
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}