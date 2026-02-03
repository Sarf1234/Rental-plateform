"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import ServiceForm from "@/components/ui/admin/ServiceForm";

export default function CreateServicePage() {
  const router = useRouter();

  async function handleCreate(payload) {
    try {
      await apiRequest("/api/service", "POST", payload);
      toast.success("Service created");
      router.push("/admin/services");
    } catch (err) {
      toast.error(err.message || "Create failed");
    }
  }

  return (
    <div className="md:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-rose-600 mb-4">
        Create Service
      </h2>

      <ServiceForm onSubmit={handleCreate} />
    </div>
  );
}
