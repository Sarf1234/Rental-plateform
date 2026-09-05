"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProductCards from "./ProductCards";
import AllProductFilters from "./AllProductFilters";
import ProductPagination from "./ProductPagination";

export default function AllProductClient({
  citySlug,
  cityName,
  initialProducts = [],
  initialPagination,
  categories = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState(initialProducts);

  const [pagination, setPagination] = useState(
    initialPagination || {
      total: 0,
      page: 1,
      pages: 1,
      limit: 24,
    },
  );

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    tags: searchParams.get("tags") || "",
    min: searchParams.get("min") || "",
    max: searchParams.get("max") || "",
    sort: searchParams.get("sort") || "newest",
  });

  /* =========================================
     FETCH PRODUCTS
  ========================================= */

  const fetchProducts = useCallback(
    async (page = 1, customFilters = filters) => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        params.set("city", citySlug);
        params.set("page", String(page));
        params.set("limit", "24");
        params.set("sort", customFilters.sort || "newest");

        if (customFilters.q?.trim()) {
          params.set("q", customFilters.q.trim());
        }

        if (customFilters.category) {
          params.set("category", customFilters.category);
        }

        if (customFilters.tags) {
          params.set("tags", customFilters.tags);
        }

        if (customFilters.min !== "") {
          params.set("min", customFilters.min);
        }

        if (customFilters.max !== "") {
          params.set("max", customFilters.max);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`,
          {
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(
            result?.message || "Failed to load products",
          );
        }

        setProducts(result?.data || []);

        setPagination(
          result?.pagination || {
            total: 0,
            page,
            pages: 1,
            limit: 24,
          },
        );
      } catch (error) {
        console.error("ALL PRODUCT FETCH ERROR:", error);

        setProducts([]);

        setPagination({
          total: 0,
          page: 1,
          pages: 1,
          limit: 24,
        });
      } finally {
        setLoading(false);
      }
    },
    [citySlug, filters],
  );

  /* =========================================
     APPLY FILTERS
  ========================================= */

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.q.trim()) {
      params.set("q", filters.q.trim());
    }

    if (filters.category) {
      params.set("category", filters.category);
    }

    if (filters.tags) {
      params.set("tags", filters.tags);
    }

    if (filters.min !== "") {
      params.set("min", filters.min);
    }

    if (filters.max !== "") {
      params.set("max", filters.max);
    }

    params.set("sort", filters.sort || "newest");
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
    fetchProducts(1, filters);
  };

  /* =========================================
     CLEAR FILTERS
  ========================================= */

  const clearFilters = () => {
    const reset = {
      q: "",
      category: "",
      tags: "",
      min: "",
      max: "",
      sort: "newest",
    };

    setFilters(reset);

    router.push(`${pathname}?sort=newest&page=1`);
    fetchProducts(1, reset);
  };

  /* =========================================
     PAGE CHANGE
  ========================================= */

  const changePage = (page) => {
    if (
      page < 1 ||
      page > pagination.pages ||
      loading
    ) {
      return;
    }

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.set("page", String(page));

    router.push(
      `${pathname}?${params.toString()}`,
    );

    fetchProducts(page, filters);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     FILTER CHANGES FROM URL
  ========================================= */

  useEffect(() => {
    const urlFilters = {
      q: searchParams.get("q") || "",
      category: searchParams.get("category") || "",
      tags: searchParams.get("tags") || "",
      min: searchParams.get("min") || "",
      max: searchParams.get("max") || "",
      sort: searchParams.get("sort") || "newest",
    };

    setFilters(urlFilters);
  }, [searchParams]);

  return (
    <section className="w-full bg-[#f6f8fa]">

      {/* =====================================
          ALL PRODUCTS HEADER / PATTI
      ===================================== */}

      {/* =====================================
    ALL PRODUCTS HEADER / PATTI
===================================== */}

<div className="w-full bg-[#003459]">
  <div
    className="
      max-w-7xl
      mx-auto
      px-4

      py-2
     

      flex
      items-center
      justify-between

      gap-3
    "
  >
    {/* LEFT */}
    <div className="min-w-0">
      <div className="flex items-center gap-2.5">
        <h2
          className="
            text-base
            md:text-xl

            font-bold
            tracking-tight

            text-white

            truncate
          "
        >
          Rental Products
        </h2>

        <span
          className="
            hidden
            sm:inline-flex

            items-center

            rounded-full

            bg-white/10
            border
            border-white/15

            px-2
            py-0.5

            text-[10px]
            md:text-[11px]

            font-semibold

            text-white

            whitespace-nowrap
          "
        >
          {cityName}
        </span>
      </div>

      <p
        className="
          mt-0.5

          text-[10px]
          sm:text-[11px]
          md:text-xs

          text-white/65
        "
      >
        {pagination.total} rental products available
      </p>
    </div>

    {/* RIGHT */}
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Availability */}
      {/* <div
        className="
          hidden
          md:flex

          items-center
          gap-1.5

          rounded-full

          bg-white/10

          border
          border-white/10

          px-3
          py-1.5

          text-[11px]

          font-medium

          text-white/85
        "
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

        Available for rent
      </div> */}

      {/* PAGE */}
      {pagination.pages > 1 && (
        <div
          className="
            flex
            items-center
            gap-1

            rounded-lg

            bg-white

            px-2.5
            py-1.5

            text-[11px]
            sm:text-xs

            shadow-sm
          "
        >
          <span className="font-semibold text-[#003459]">
            {pagination.page}
          </span>

          <span className="text-gray-300">
            /
          </span>

          <span className="text-gray-500">
            {pagination.pages}
          </span>
        </div>
      )}
    </div>
  </div>
</div>

      {/* =====================================
          MAIN PRODUCT AREA
      ===================================== */}

      <div
        className="
          max-w-7xl
          mx-auto

          px-4

          pt-4
          md:pt-5

          pb-12
          md:pb-16
        "
      >
        <div
          className="
            flex
            flex-col
            md:flex-row

            gap-4
            md:gap-5
          "
        >

          {/* FILTERS */}

          <AllProductFilters
            filters={filters}
            categories={categories}
            loading={loading}
            onChange={setFilters}
            onApply={applyFilters}
            onClear={clearFilters}
          />

          {/* PRODUCTS */}

          <div className="min-w-0 flex-1">

            {/* LOADING */}
            {loading && <ProductGridSkeleton />}

            {/* EMPTY */}
            {!loading && products.length === 0 && (
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

                <h3
                  className="
                    mt-4

                    text-lg

                    font-semibold

                    text-gray-900
                  "
                >
                  No rental products found
                </h3>

                <p
                  className="
                    mt-2

                    text-sm

                    text-gray-500
                  "
                >
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    mt-5

                    rounded-lg

                    bg-[#003459]

                    px-5
                    py-2.5

                    text-sm
                    font-medium

                    text-white

                    transition

                    hover:bg-[#002b4a]
                  "
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* PRODUCT GRID */}
            {!loading && products.length > 0 && (
              <>
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
                    <ProductCards
                      key={product._id}
                      product={product}
                      citySlug={citySlug}
                    />
                  ))}
                </div>

                {/* PAGINATION */}

                {pagination.pages > 1 && (
                  <div className="mt-8">
                    <ProductPagination
                      page={pagination.page}
                      pages={pagination.pages}
                      loading={loading}
                      onPageChange={changePage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================
   PRODUCT SKELETON
========================================= */

function ProductGridSkeleton() {
  return (
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
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden

            rounded-2xl

            border
            border-gray-100

            bg-white
          "
        >
          <div
            className="
              aspect-[4/3]

              animate-pulse

              bg-gray-200
            "
          />

          <div
            className="
              p-3
              sm:p-4

              space-y-2.5
            "
          >
            <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />

            <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />

            <div className="mt-3 h-8 w-full rounded-lg bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}