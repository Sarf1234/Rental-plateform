"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BusinessForm from "@/components/ui/admin/BusinessForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function EditBusinessPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest(`/api/business/${slug}`);
        setBusiness(res.data || res);
      } catch {
        toast.error("Failed to load business");
      }
    }
    if (slug) load();
  }, [slug]);

  async function handleUpdate(payload) {
    try {
      await apiRequest(`/api/business/${slug}`, "PUT", payload);
      toast.success("Business updated");
      router.push("/admin/businesses");
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  }

  if (!business) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
        Edit Business
      </h2>

      <BusinessForm initialData={business} onSubmit={handleUpdate} />
    </div>
  );
}
