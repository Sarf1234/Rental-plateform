"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LocationProfileForm from "@/components/ui/admin/LocationProfileForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function EditLocationProfile() {
  const params = useParams();
  const id = params?.id;

  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!id) return;

    let isMounted = true; // prevent memory issues

    async function fetchData() {
      try {
        setLoading(true);

        const res = await apiRequest(
          `/api/admin/location-profiles/${id}`
        );

        if (!isMounted) return;

        setData(res.data);
      } catch (err) {
        console.error("Fetch error:", err);

        if (!isMounted) return;

        setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  /* ================= UPDATE ================= */
  async function handleUpdate(payload) {
    try {
      await apiRequest(
        `/api/admin/location-profiles/${id}`,
        "PUT",
        payload
      );

      toast.success("Profile updated successfully");

      // small delay for better UX
      setTimeout(() => {
        router.push("/admin/location-profiles");
      }, 800);

    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed");
    }
  }

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 space-y-3">
        <p>Failed to load profile.</p>
        <button
          onClick={() => router.push("/admin/location-profiles")}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Back to list
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-gray-500">
        No data found
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 pt-4">
        <h1 className="text-xl font-semibold">
          Edit Location Profile
        </h1>

        <button
          onClick={() => router.push("/admin/location-profiles")}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to list
        </button>
      </div>

      {/* FORM */}
      <LocationProfileForm
        initialData={data}
        onSubmit={handleUpdate}
      />
    </div>
  );
}