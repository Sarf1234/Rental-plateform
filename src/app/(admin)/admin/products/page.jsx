"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-indigo-600">
          Products
        </h1>

        <Link href="/admin/products/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            + Add Product
          </Button>
        </Link>
      </div>

      {loading && <div>Loading…</div>}

      {!loading && products.length === 0 && (
        <div className="border border-dashed rounded-lg p-10 text-center bg-blue-50">
          <h2 className="text-lg font-medium text-blue-600">
            No services products
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create your first product
          </p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="border rounded bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {p.title}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs rounded bg-gray-100">
                      {p.status}
                    </span>
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
