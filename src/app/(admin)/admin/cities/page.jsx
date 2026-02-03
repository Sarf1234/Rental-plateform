"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function CitiesList() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await apiRequest("/api/cities?page=1&limit=100");
        const data = res.data || [];
        if (!mounted) return;
        setCities(data);
      } catch (err) {
        toast.error("Failed to load cities");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  async function handleDeactivate(slug) {
    if (!confirm("Deactivate this city?")) return;
    try {
      await apiRequest(`/api/cities/${slug}`, "DELETE");
      setCities((c) => c.filter((x) => x.slug !== slug));
      toast.success("City deactivated");
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-blue-600">Cities</h1>
          <p className="text-sm text-gray-500">
            Manage service cities and SEO metadata
          </p>
        </div>

        <Link href="/admin/cities/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            + Create City
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-sm text-gray-500">Loading cities…</div>
      )}

      {/* Empty */}
      {!loading && cities.length === 0 && (
        <div className="border border-dashed rounded-lg p-10 text-center bg-blue-50">
          <h2 className="text-lg font-medium text-blue-600">
            No cities found
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create your first city
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && cities.length > 0 && (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cities.map((city) => (
                <tr
                  key={city._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* City */}
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {city.name}
                  </td>

                  {/* State */}
                  <td className="px-4 py-3 text-gray-600">
                    {city.state}
                  </td>

                  {/* Slug */}
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {city.slug}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    {city.isActive ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <Link href={`/admin/cities/${city.slug}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:border-blue-600 hover:text-blue-600"
                      >
                        Edit
                      </Button>
                    </Link>

                    <Link href={`/cities/${city.slug}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:border-green-600 hover:text-green-600"
                      >
                        View
                      </Button>
                    </Link>

                    {/* Optional soft delete */}
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeactivate(city.slug)}
                    >
                      Deactivate
                    </Button> 
                   
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
