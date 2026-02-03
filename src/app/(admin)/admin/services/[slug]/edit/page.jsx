"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import ServiceForm from "@/components/ui/admin/ServiceForm";

export default function EditServicePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await apiRequest(`/api/service/${slug}`);
        if (!mounted) return;
        setService(res.data);
      } catch {
        toast.error("Failed to load service");
      }
    }

    if (slug) load();
    return () => (mounted = false);
  }, [slug]);

  async function handleUpdate(payload) {
    try {
      await apiRequest(`/api/service/${slug}`, "PUT", payload);
      toast.success("Service updated");
      router.push("/admin/services");
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  }

  if (!service) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-rose-600 mb-4">
        Edit Service
      </h2>

      <ServiceForm initialData={service} onSubmit={handleUpdate} />
    </div>
  );
}
