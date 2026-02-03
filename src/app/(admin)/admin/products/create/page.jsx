"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/ui/admin/ProductForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function CreateProduct() {
  const router = useRouter();

  async function handleCreate(payload) {
    await apiRequest("/api/products", "POST", payload);
    toast.success("Product created");
    router.push("/admin/products");
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Create Product</h2>
      <ProductForm onSubmit={handleCreate} />
    </>
  );
}
