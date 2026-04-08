"use client";
export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function BusinessesList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FILTER STATES ================= */
  const [selectedCity, setSelectedCity] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [search, setSearch] = useState("");

  /* ================= LOAD SAVED CITY ================= */
  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) setSelectedCity(savedCity);
  }, []);

  /* ================= SAVE CITY ================= */
  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem("selectedCity", selectedCity);
    } else {
      localStorage.removeItem("selectedCity");
    }
  }, [selectedCity]);

  /* ================= FETCH DATA ================= */
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

  /* ================= UNIQUE CITIES ================= */
  const allCities = useMemo(() => {
    const set = new Set();
    businesses.forEach((b) => {
      (b.serviceAreas || []).forEach((c) => {
        if (c?.name) set.add(c.name);
      });
    });
    return Array.from(set);
  }, [businesses]);

  /* ================= FILTER + SEARCH ================= */
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((biz) => {
      // 🔹 City filter
      if (selectedCity) {
        const matchCity = (biz.serviceAreas || []).some(
          (c) => c.name === selectedCity
        );
        if (!matchCity) return false;
      }

      // 🔹 Status filter
      if (statusFilter && biz.status !== statusFilter) return false;

      // 🔹 Verified filter
      if (
        verifiedFilter &&
        String(biz.isVerified) !== verifiedFilter
      )
        return false;

      // 🔥 SEARCH (manual fast search)
      if (search) {
        const text = `${biz.name} ${biz.phone} ${
          (biz.serviceAreas || []).map((c) => c.name).join(" ")
        }`.toLowerCase();

        if (!text.includes(search.toLowerCase())) return false;
      }

      return true;
    });
  }, [businesses, selectedCity, statusFilter, verifiedFilter, search]);

  /* ================= ACTION ================= */
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
      {/* HEADER */}
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

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap gap-3 mb-6">
        
        {/* 🔍 SEARCH */}
        <input
          type="text"
          placeholder="Search business..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-60"
        />

        {/* CITY */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Cities</option>
          {allCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* STATUS */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* VERIFIED */}
        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All</option>
          <option value="true">Verified</option>
          <option value="false">Pending</option>
        </select>

        {/* RESET */}
        <Button
          variant="outline"
          onClick={() => {
            setSelectedCity("");
            setStatusFilter("");
            setVerifiedFilter("");
            setSearch("");
          }}
        >
          Reset
        </Button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-sm text-gray-500">
          Loading businesses…
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredBusinesses.length === 0 && (
        <div className="border border-dashed rounded-lg p-10 text-center bg-indigo-50">
          <h2 className="text-lg font-medium text-indigo-600">
            No businesses found
          </h2>
        </div>
      )}

      {/* TABLE */}
      {!loading && filteredBusinesses.length > 0 && (
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
              {filteredBusinesses.map((biz) => (
                <tr key={biz._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {biz.name}
                  </td>

                  <td className="px-4 py-3">{biz.phone}</td>

                  <td className="px-4 py-3">
                    {(biz.serviceAreas || [])
                      .map((c) => c.name)
                      .join(", ") || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {biz.status === "active" ? "Active" : "Inactive"}
                  </td>

                  <td className="px-4 py-3">
                    {biz.isVerified ? "Verified" : "Pending"}
                  </td>

                  <td className="px-4 py-3 text-right flex gap-2 justify-end">
                    <Link href={`/admin/businesses/${biz.slug}/edit`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>

                    <Link href={`/business/${biz.slug}`}>
                      <Button size="sm" variant="outline">
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