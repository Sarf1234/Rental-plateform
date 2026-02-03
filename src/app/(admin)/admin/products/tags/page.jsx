"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function ProductTagsList() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await apiRequest("/api/products/tags?active=false");
        if (mounted) setTags(res.data || []);
      } catch {
        toast.error("Failed to load product tags");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-indigo-600">
            Product Tags
          </h1>
          <p className="text-sm text-gray-500">
            Manage product tags and SEO
          </p>
        </div>

        <Link href="/admin/products/tags/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            + Create Tag
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-sm text-gray-500">Loading…</div>
      )}

      {/* Empty */}
      {!loading && tags.length === 0 && (
        <div className="border border-dashed rounded-lg p-10 text-center bg-indigo-50">
          <h2 className="text-lg font-medium text-indigo-600">
            No tags found
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create your first product tag
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && tags.length > 0 && (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tags.map((tag) => (
                <tr
                  key={tag._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {tag.name}
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {tag.slug}
                  </td>

                  <td className="px-4 py-3">
                    {tag.isActive ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/tags/${tag.slug}/edit`}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:border-indigo-600 hover:text-indigo-600"
                      >
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
