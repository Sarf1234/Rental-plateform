"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function LocationProfilesList() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [allCities, setAllCities] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allServices, setAllServices] = useState([]);

  /* FILTERS */
  const [cityFilter, setCityFilter] = useState("");
  const [scopeFilter, setScopeFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  async function loadProfiles() {
    setLoading(true);

    const params = new URLSearchParams();
    if (cityFilter) params.append("city", cityFilter);
    if (scopeFilter) params.append("scope", scopeFilter);
    if (productFilter) params.append("product", productFilter);
    if (serviceFilter) params.append("service", serviceFilter);

    try {
      const res = await apiRequest(
        `/api/admin/location-profiles?${params.toString()}`
      );
      setProfiles(res.data || []);
    } catch {
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    apiRequest("/api/cities").then((r) =>
      setAllCities(r.data || [])
    );
    apiRequest("/api/products?limit=500").then((r) =>
      setAllProducts(r.data || [])
    );
    apiRequest("/api/service/admin?limit=500").then((r) =>
      setAllServices(r.data || [])
    );

    loadProfiles();
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [cityFilter, scopeFilter, productFilter, serviceFilter]);

  async function handleDelete(id) {
    if (!confirm("Delete this profile?")) return;

    try {
      await apiRequest(
        `/api/admin/location-profiles/${id}`,
        "DELETE"
      );
      setProfiles((prev) =>
        prev.filter((p) => p._id !== id)
      );
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-rose-600">
            Location Profiles
          </h1>
          <p className="text-sm text-gray-500">
            Manage city-based overlays
          </p>
        </div>

        <Link href="/admin/location-profiles/create">
          <Button className="bg-rose-600 hover:bg-rose-700">
            + Create Profile
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-md p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Cities</option>
          {allCities.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={scopeFilter}
          onChange={(e) => setScopeFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Scopes</option>
          <option value="city">City</option>
          <option value="product">Product</option>
          <option value="service">Service</option>
          <option value="productCategory">Product Category</option>
          <option value="serviceCategory">Service Category</option>
        </select>

        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Products</option>
          {allProducts.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Services</option>
          {allServices.map((s) => (
            <option key={s._id} value={s._id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && <div>Loading...</div>}

      {/* Empty */}
      {!loading && profiles.length === 0 && (
        <div className="border rounded-md p-10 text-center bg-rose-50">
          No profiles found
        </div>
      )}

      {/* Table */}
      {!loading && profiles.length > 0 && (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Scope</th>
                <th className="px-4 py-3 text-left">Target</th>
                <th className="px-4 py-3 text-left">Demand</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {profiles.map((p) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {p.city?.name}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    {p.scope}
                  </td>

                  <td className="px-4 py-3">
                    {p.product?.title ||
                      p.service?.title ||
                      p.productCategory?.name ||
                      p.serviceCategory?.name ||
                      "City"}
                  </td>

                  <td className="px-4 py-3">
                    {p.demandLevel}
                  </td>

                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <Link
                      href={`/admin/location-profiles/${p._id}/edit`}
                    >
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
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