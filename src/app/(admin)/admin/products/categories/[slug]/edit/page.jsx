"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductCategoryForm from "@/components/ui/admin/ProductCategoryForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function EditProductCategory() {
  const { slug } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest(`/api/products/categories/${slug}`);
        setData(res.data || res);
      } catch {
        toast.error("Failed to load category");
      }
    })();
  }, [slug]);

  async function handleUpdate(payload) {
    await apiRequest(`/api/products/categories/${slug}`, "PUT", payload);
    toast.success("Category updated");
    router.push("/admin/products/categories");
  }

  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Edit Category</h2>
      <ProductCategoryForm initialData={data} onSubmit={handleUpdate} />
    </div>
  );
}
