"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    featured: false,
    bestDeal: false,
    topRented: false,
    newProduct: false,
    status: "all",
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await apiRequest("/api/products/admin?page=1&limit=50");
        if (mounted) setProducts(res.data || []);
      } catch {
        toast.error("Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  // FILTER
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.featured && !p.highlights?.isFeatured) return false;
      if (filters.bestDeal && !p.highlights?.isBestDeal) return false;
      if (filters.topRented && !p.highlights?.isTopRented) return false;
      if (filters.newProduct && !p.highlights?.isNewProduct) return false;
      if (filters.status !== "all" && p.status !== filters.status)
        return false;

      return true;
    });
  }, [products, filters]);

  // SORT
  const sortedProducts = useMemo(() => {
    let data = [...filteredProducts];

    if (sort === "priceLow") {
      data.sort((a, b) => a.pricing?.minPrice - b.pricing?.minPrice);
    }

    if (sort === "priceHigh") {
      data.sort((a, b) => b.pricing?.minPrice - a.pricing?.minPrice);
    }

    if (sort === "latest") {
      data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return data;
  }, [filteredProducts, sort]);

  // SEARCH
  const finalProducts = useMemo(() => {
    return sortedProducts.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedProducts, search]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-indigo-600">
          Products
        </h1>

        {!loading && (
          <p className="text-sm text-gray-500 mt-1">
            {finalProducts.length} of {products.length} products
          </p>
        )}

        <Link href="/admin/products/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            + Add Product
          </Button>
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={filters.featured ? "default" : "outline"}
          onClick={() =>
            setFilters((f) => ({ ...f, featured: !f.featured }))
          }
        >
          Featured
        </Button>

        <Button
          variant={filters.bestDeal ? "default" : "outline"}
          onClick={() =>
            setFilters((f) => ({ ...f, bestDeal: !f.bestDeal }))
          }
        >
          Best Deal
        </Button>

        <Button
          variant={filters.topRented ? "default" : "outline"}
          onClick={() =>
            setFilters((f) => ({ ...f, topRented: !f.topRented }))
          }
        >
          Top Rented
        </Button>

        <Button
          variant={filters.newProduct ? "default" : "outline"}
          onClick={() =>
            setFilters((f) => ({ ...f, newProduct: !f.newProduct }))
          }
        >
          New
        </Button>

        <select
          className="border px-3 py-1 rounded"
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-1 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-1 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="priceLow">Price Low → High</option>
          <option value="priceHigh">Price High → Low</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && <div>Loading…</div>}

      {/* EMPTY */}
      {!loading && finalProducts.length === 0 && (
        <div className="border border-dashed rounded-lg p-10 text-center bg-blue-50">
          <h2 className="text-lg font-medium text-blue-600">
            No products found
          </h2>
        </div>
      )}

      

      {/* TABLE */}
      {!loading && finalProducts.length > 0 && (
        <div className="border rounded bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Highlights</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {finalProducts.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {p.title}
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs rounded bg-gray-100">
                      {p.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.highlights?.isFeatured && (
                        <span className="text-xs bg-purple-100 px-2 rounded">
                          Featured
                        </span>
                      )}
                      {p.highlights?.isBestDeal && (
                        <span className="text-xs bg-green-100 px-2 rounded">
                          Best Deal
                        </span>
                      )}
                      {p.highlights?.isTopRented && (
                        <span className="text-xs bg-blue-100 px-2 rounded">
                          Top
                        </span>
                      )}
                      {p.highlights?.isNewProduct && (
                        <span className="text-xs bg-yellow-100 px-2 rounded">
                          New
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.slug}/edit`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}