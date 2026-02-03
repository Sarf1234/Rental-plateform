"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import ProductTagForm from "@/components/ui/admin/ProductTagForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function CreateProductTag() {
  const router = useRouter();

  async function handleCreate(payload) {
    await apiRequest("/api/products/tags", "POST", payload);
    toast.success("Tag created");
    router.push("/admin/products/tags");
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
        Create Product Tag
      </h2>

      <ProductTagForm onSubmit={handleCreate} />
    </div>
  );
}
