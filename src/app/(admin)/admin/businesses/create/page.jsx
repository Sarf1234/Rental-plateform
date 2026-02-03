"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import BusinessForm from "@/components/ui/admin/BusinessForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function CreateBusinessPage() {
  const router = useRouter();

  async function handleCreate(payload) {
    try {
      await apiRequest("/api/business", "POST", payload);
      toast.success("Business created");
      router.push("/admin/businesses");
    } catch (err) {
      toast.error(err.message || "Create failed");
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
        Create Business
      </h2>

      <BusinessForm onSubmit={handleCreate} />
    </div>
  );
}
