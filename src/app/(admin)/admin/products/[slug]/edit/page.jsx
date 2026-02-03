"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/ui/admin/ProductForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function EditProduct() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest(`/api/products/${slug}`);
        setProduct(res.data || res);
      } catch {
        toast.error("Failed to load product");
      }
    }
    if (slug) load();
  }, [slug]);

  async function handleUpdate(payload) {
    await apiRequest(`/api/products/${slug}`, "PUT", payload);
    toast.success("Product updated");
    router.push("/admin/products");
  }

  if (!product) return <div>Loading…</div>;

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
      <ProductForm initialData={product} onSubmit={handleUpdate} />
    </>
  );
}
