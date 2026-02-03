"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import ProductCategoryForm from "@/components/ui/admin/ProductCategoryForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function CreateProductCategory() {
  const router = useRouter();

  async function handleCreate(payload) {
    await apiRequest("/api/products/categories", "POST", payload);
    toast.success("Category created");
    router.push("/admin/products/categories");
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Create Category</h2>
      <ProductCategoryForm onSubmit={handleCreate} />
    </div>
  );
}
