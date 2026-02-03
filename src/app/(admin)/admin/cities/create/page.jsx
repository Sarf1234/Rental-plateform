"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import CityForm from "@/components/ui/admin/CityForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function CreateCityPage() {
  const router = useRouter();

  async function handleCreate(payload) {
    try {
      await apiRequest("/api/cities", "POST", payload);
      toast.success("City created");
      router.push("/admin/cities");
    } catch (err) {
      toast.error(err.message || "Create failed");
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        Create City
      </h2>

      <CityForm
        onSubmit={handleCreate}
        mode="create"   // optional, future-proof
      />
    </div>
  );
}
