"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await apiRequest("/api/service/admin?page=1&limit=50");
        if (!mounted) return;
        setServices(res.data || []);
      } catch (err) {
        toast.error("Failed to load services");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-rose-600">Services</h1>
          <p className="text-sm text-gray-500">
            Manage all services (draft, published, archived)
          </p>
        </div>

        <Link href="/admin/services/create">
          <Button className="bg-rose-600 hover:bg-rose-700">
            + Create Service
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-sm text-gray-500">Loading services…</div>
      )}

      {/* Empty */}
      {!loading && services.length === 0 && (
        <div className="border border-dashed rounded-lg p-10 text-center bg-rose-50">
          <h2 className="text-lg font-medium text-rose-600">
            No services found
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create your first service
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && services.length > 0 && (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.map((s) => (
                <tr
                  key={s._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {s.title}
                    {s.isFeatured && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                    {s.isTopService && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Top
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {s.provider?.name || "—"}
                  </td>

                  <td className="px-4 py-3 capitalize text-gray-500">
                    {s.serviceType?.replace("_", " ")}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        s.status === "published"
                          ? "bg-green-100 text-green-700"
                          : s.status === "draft"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right flex gap-2 justify-end">
                    <Link href={`/admin/services/${s.slug}/edit`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>

                    <Link href={`/services/${s.slug}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:border-green-600 hover:text-green-600"
                      >
                        View
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
