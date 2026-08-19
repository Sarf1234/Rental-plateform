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

  const currentPage = Number(searchParams.get("page")) || 1;

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

        /*
         IMPORTANT:
         sort makes API enter SEARCH MODE
        */

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
          throw new Error(result?.message || "Failed to load products");
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
    if (page < 1 || page > pagination.pages || loading) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    router.push(`${pathname}?${params.toString()}`);

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
    <section className="max-w-7xl mx-auto">
      <div className="max-w-7xl px-4 pb-2 ">
        <div className="max-w-6xl">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Rental Products
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} products available in {cityName}
          </p>
        </div>

        {pagination.pages > 1 && (
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </p>
        )}
      </div>

      <div className="max-w-7xl md:flex gap-2 mx-auto px-4 pb-16">
        {/* FILTERS */}

        <AllProductFilters
          filters={filters}
          categories={categories}
          loading={loading}
          onChange={setFilters}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        {/* RESULT HEADER */}

        {/* LOADING */}
        <div>
          {loading && <ProductGridSkeleton />}

          {/* EMPTY */}

          {!loading && products.length === 0 && (
            <div className="rounded-2xl border bg-gray-50 px-5 py-16 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                No rental products found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg bg-[#003459] px-5 py-2.5 text-sm font-medium text-white"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* PRODUCT GRID */}

          {!loading && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
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
                <ProductPagination
                  page={pagination.page}
                  pages={pagination.pages}
                  loading={loading}
                  onPageChange={changePage}
                />
              )}
            </>
          )}
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
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border bg-white">
          <div className="aspect-square animate-pulse bg-gray-200" />

          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />

            <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />

            <div className="h-8 w-full rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
