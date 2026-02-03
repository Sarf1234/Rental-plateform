"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CityForm from "@/components/ui/admin/CityForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function EditCityPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [city, setCity] = useState(null);

  // 🔹 Load city data
  useEffect(() => {
    let mounted = true;

    async function loadCity() {
      try {
        const res = await apiRequest(`/api/cities/${slug}`, "GET");
        const data = res.data || res.city || res;
        if (!mounted) return;
        setCity(data);
      } catch (err) {
        toast.error("Failed to load city");
      }
    }

    if (slug) loadCity();
    return () => (mounted = false);
  }, [slug]);

  async function handleUpdate(payload) {
    try {
      await apiRequest(`/api/cities/${slug}`, "PUT", payload);
      toast.success("City updated");
      router.push("/admin/cities");
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  }

  if (!city) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        Edit City
      </h2>

      <CityForm
        initialData={city}
        onSubmit={handleUpdate}
        mode="edit"   // optional, future-proof
      />
    </div>
  );
}
