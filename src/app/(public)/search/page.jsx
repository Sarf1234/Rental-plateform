import ProductCard from "@/components/ui/public/ProductCards";
import { apiRequest } from "@/lib/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const params = (await searchParams) || {};

  const q = params?.q?.trim() || "";
  const city = params?.city?.trim() || "";
  const page = Math.max(Number(params?.page) || 1, 1);

  /* =========================================
     EMPTY SEARCH
  ========================================= */

  if (!q) {
    return (
      <main className="min-h-screen bg-[#f6f8fa] pt-20">
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef6fa] text-2xl">
              🔎
            </div>

            <h1 className="mt-5 text-xl md:text-2xl font-bold text-gray-900">
              Search rental products
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm md:text-base text-gray-500">
              Search for chairs, tables, decor, lighting, sound systems
              and other rental products.
            </p>

            <Link
              href={city ? `/${city}/products` : "/products"}
              className="
                mt-6
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-[#003459]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#002b4a]
              "
            >
              Browse Rentals
            </Link>
          </div>
        </div>
      </main>
    );
  }

  let products = [];
  let pagination = null;
  let error = null;

  /* =========================================
     SEARCH API
  ========================================= */

  try {
    const url =
      `${process.env.NEXT_PUBLIC_API_URL}/api/products` +
      `?q=${encodeURIComponent(q)}` +
      `${city ? `&city=${encodeURIComponent(city)}` : ""}` +
      `&page=${page}`;

    const res = await apiRequest(url);

    products = Array.isArray(res?.data) ? res.data : [];
    pagination = res?.pagination || null;
  } catch (err) {
    console.error("Search API error:", err);
    error = "Something went wrong while fetching products.";
  }

  const total = pagination?.total ?? products.length;
  const totalPages = pagination?.pages ?? 1;

  const cityName = city
    ? city
        .split("-")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ")
    : "";

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-[#f6f8fa] pt-15">
      {/* =====================================
          SEARCH HEADER
      ===================================== */}

      <section className="w-full bg-[#eef5f8] border-y border-[#d9e6eb]">
  <div className="max-w-7xl mx-auto px-4">
    <div
      className="
        flex
        items-center
        justify-between
        gap-4

        py-4
        sm:py-5
        md:py-5.5
      "
    >
      {/* LEFT */}
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span
            className="
              h-7
              w-1
              flex-shrink-0

              rounded-full

              bg-[#003459]
            "
          />

          <h1
            className="
              text-lg
              sm:text-xl
              md:text-2xl

              font-bold
              tracking-tight

              text-[#0f172a]
            "
          >
            Search Results
          </h1>
        </div>

        <div
          className="
            mt-2

            flex
            flex-wrap
            items-center

            gap-1.5
            sm:gap-2
          "
        >
          <span
            className="
              text-xs
              sm:text-sm

              font-medium

              text-slate-500
            "
          >
            Showing results for
          </span>

          {/* QUERY */}
          <span
            title={q}
            className="
              max-w-[180px]
              sm:max-w-[280px]

              truncate

              rounded-md

              border
              border-[#c9dbe2]

              bg-white

              px-2.5
              py-1

              text-xs
              sm:text-sm

              font-semibold

              text-[#003459]

              shadow-[0_1px_2px_rgba(15,23,42,0.03)]
            "
          >
            "{q}"
          </span>

          {/* CITY */}
          {cityName && (
            <>
              <span className="text-slate-300">
                •
              </span>

              <span
                className="
                  rounded-md

                  bg-[#dcecf2]

                  px-2
                  py-1

                  text-[11px]
                  sm:text-xs

                  font-medium

                  text-[#335b6b]
                "
              >
                {cityName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* RIGHT RESULT COUNT */}
      <div
        className="
          flex
          flex-shrink-0
          items-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-2

            rounded-xl

            border
            border-[#d3e2e7]

            bg-white

            px-3
            sm:px-4

            py-2

            shadow-[0_1px_3px_rgba(15,23,42,0.04)]
          "
        >
          <div
            className="
              flex
              h-2
              w-2

              flex-shrink-0

              rounded-full

              bg-emerald-500
            "
          />

          <div className="leading-tight">
            <div className="flex items-baseline gap-1">
              <span
                className="
                  text-base
                  sm:text-lg
                  md:text-xl

                  font-bold

                  text-[#0f172a]
                "
              >
                {total}
              </span>

              <span
                className="
                  text-[11px]
                  sm:text-xs

                  font-medium

                  text-slate-500
                "
              >
                {total === 1 ? "product" : "products"}
              </span>
            </div>

            <span
              className="
                hidden
                sm:block

                text-[10px]

                text-slate-400
              "
            >
              available
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* =====================================
          RESULTS AREA
      ===================================== */}

      <div className="max-w-7xl mx-auto px-4 pt-5 pb-12 md:pt-6 md:pb-16">

        {/* ERROR */}
        {error && (
          <div
            className="
              rounded-2xl
              border
              border-red-100
              bg-red-50
              px-5
              py-8
              text-center
            "
          >
            <h2 className="font-semibold text-red-700">
              Unable to load search results
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* RESULTS */}
        {!error && products.length > 0 && (
          <>
            {/* SMALL RESULTS TOOLBAR */}
            <div
              className="
                mb-4
                flex
                items-center
                justify-between
              "
            >
              <p className="text-xs sm:text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {products.length}
                </span>{" "}
                rental options
              </p>

              {totalPages > 1 && (
                <span className="text-xs text-gray-400">
                  Page {page} of {totalPages}
                </span>
              )}
            </div>

            {/* PRODUCT GRID */}
            <div
              className="
                grid

                grid-cols-2

                gap-3

                sm:gap-4

                md:grid-cols-3

                lg:grid-cols-4

                xl:gap-5
              "
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  citySlug={city}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={buildSearchUrl({
                      q,
                      city,
                      page: page - 1,
                    })}
                    className="
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-gray-700
                      shadow-sm
                      transition
                      hover:border-[#003459]
                      hover:text-[#003459]
                    "
                  >
                    ← Previous
                  </Link>
                )}

                <div
                  className="
                    rounded-lg
                    bg-[#003459]
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  {page}
                </div>

                {page < totalPages && (
                  <Link
                    href={buildSearchUrl({
                      q,
                      city,
                      page: page + 1,
                    })}
                    className="
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-gray-700
                      shadow-sm
                      transition
                      hover:border-[#003459]
                      hover:text-[#003459]
                    "
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* EMPTY */}
        {!error && products.length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-5
              py-16
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-xl
              "
            >
              🔎
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-semibold
                text-gray-900
              "
            >
              No rental products found
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-gray-500
              "
            >
              We couldn't find any products matching{" "}
              <span className="font-medium text-gray-700">
                "{q}"
              </span>
              {cityName ? ` in ${cityName}` : ""}.
            </p>

            <Link
              href={
                city
                  ? `/${city}/products`
                  : "/products"
              }
              className="
                mt-6
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-[#003459]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#002b4a]
              "
            >
              Browse All Rentals
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

/* =========================================
   SEARCH URL HELPER
========================================= */

function buildSearchUrl({ q, city, page }) {
  const params = new URLSearchParams();

  params.set("q", q);

  if (city) {
    params.set("city", city);
  }

  params.set("page", String(page));

  return `/search?${params.toString()}`;
}