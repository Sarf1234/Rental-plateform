"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTER STATE
  const [filters, setFilters] = useState({
    featured: false,
    top: false,
    best: false,
    status: "all",
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

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

  // FILTER LOGIC
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (filters.featured && !s.isFeatured) return false;
      if (filters.top && !s.isTopService) return false;
      if (filters.best && !s.isBestService) return false;
      if (filters.status !== "all" && s.status !== filters.status)
        return false;

      return true;
    });
  }, [services, filters]);

  // SORT
  const sortedServices = useMemo(() => {
    let data = [...filteredServices];

    if (sort === "priceLow") {
      data.sort((a, b) => a.pricing?.amount - b.pricing?.amount);
    }

    if (sort === "priceHigh") {
      data.sort((a, b) => b.pricing?.amount - a.pricing?.amount);
    }

    if (sort === "latest") {
      data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return data;
  }, [filteredServices, sort]);

  // SEARCH
  const finalServices = useMemo(() => {
    return sortedServices.filter((s) =>
      s.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedServices, search]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-rose-600">
            Services
          </h1>
          {!loading && (
      <p className="text-sm text-gray-500 mt-1">
        {finalServices.length} of {services.length} services
      </p>
    )}
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
          variant={filters.top ? "default" : "outline"}
          onClick={() =>
            setFilters((f) => ({ ...f, top: !f.top }))
          }
        >
          Top Service
        </Button>

        <Button
          variant={filters.best ? "default" : "outline"}
          onClick={() =>
            setFilters((f) => ({ ...f, best: !f.best }))
          }
        >
          Best Service
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
          placeholder="Search service..."
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
      {loading && (
        <div className="text-sm text-gray-500">Loading services…</div>
      )}

      {/* EMPTY */}
      {!loading && finalServices.length === 0 && (
        <div className="border border-dashed rounded-lg p-10 text-center bg-rose-50">
          <h2 className="text-lg font-medium text-rose-600">
            No services found
          </h2>
        </div>
      )}

      

      {/* TABLE */}
      {!loading && finalServices.length > 0 && (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Highlights</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {finalServices.map((s) => (
                <tr
                  key={s._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {s.title}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {s.providers?.[0]?.name || "—"}
                  </td>

                  <td className="px-4 py-3 capitalize text-gray-500">
                    {s.serviceType?.replace("_", " ")}
                  </td>

                  {/* HIGHLIGHTS */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.isFeatured && (
                        <span className="text-xs bg-yellow-100 px-2 rounded">
                          Featured
                        </span>
                      )}
                      {s.isTopService && (
                        <span className="text-xs bg-blue-100 px-2 rounded">
                          Top
                        </span>
                      )}
                      {s.isBestService && (
                        <span className="text-xs bg-green-100 px-2 rounded">
                          Best
                        </span>
                      )}
                    </div>
                  </td>

                  {/* STATUS */}
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

                  {/* ACTIONS */}
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