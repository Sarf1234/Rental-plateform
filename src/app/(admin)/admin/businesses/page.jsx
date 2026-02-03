"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function BusinessesList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await apiRequest("/api/business?page=1&limit=100");
        const data = res.data || [];
        if (!mounted) return;
        setBusinesses(data);
      } catch (err) {
        toast.error("Failed to load businesses");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  async function handleDeactivate(slug) {
    if (!confirm("Deactivate this business?")) return;
    try {
      await apiRequest(`/api/business/${slug}`, "DELETE");
      setBusinesses((b) => b.filter((x) => x.slug !== slug));
      toast.success("Business deactivated");
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-indigo-600">
            Businesses
          </h1>
          <p className="text-sm text-gray-500">
            Manage listed businesses and verification
          </p>
        </div>

        <Link href="/admin/businesses/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            + Create Business
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-sm text-gray-500">
          Loading businesses…
        </div>
      )}

      {/* Empty */}
      {!loading && businesses.length === 0 && (
        <div className="border border-dashed rounded-lg p-10 text-center bg-indigo-50">
          <h2 className="text-lg font-medium text-indigo-600">
            No businesses found
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create your first business listing
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && businesses.length > 0 && (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Cities</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {businesses.map((biz) => (
                <tr
                  key={biz._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Name */}
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {biz.name}
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 text-gray-600">
                    {biz.phone}
                  </td>

                  {/* Cities */}
                  <td className="px-4 py-3 text-gray-600">
                    {(biz.serviceAreas || [])
                      .map((c) => c.name)
                      .join(", ") || "—"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    {biz.status === "active" ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Verified */}
                  <td className="px-4 py-3">
                    {biz.isVerified ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <Link href={`/admin/businesses/${biz.slug}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:border-indigo-600 hover:text-indigo-600"
                      >
                        Edit
                      </Button>
                    </Link>

                    <Link href={`/business/${biz.slug}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:border-green-600 hover:text-green-600"
                      >
                        View
                      </Button>
                    </Link>

                    {/* Optional soft delete */}
                    {/*
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeactivate(biz.slug)}
                    >
                      Deactivate
                    </Button>
                    */}
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
