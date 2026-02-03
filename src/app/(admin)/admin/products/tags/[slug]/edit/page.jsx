"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductTagForm from "@/components/ui/admin/ProductTagForm";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function EditProductTag() {
  const { slug } = useParams();
  const router = useRouter();
  const [tag, setTag] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await apiRequest(
          `/api/products/tags/${slug}`
        );
        if (mounted) setTag(res.data || res);
      } catch {
        toast.error("Failed to load tag");
      }
    }

    if (slug) load();
    return () => (mounted = false);
  }, [slug]);

  async function handleUpdate(payload) {
    await apiRequest(
      `/api/products/tags/${slug}`,
      "PUT",
      payload
    );
    toast.success("Tag updated");
    router.push("/admin/products/tags");
  }

  if (!tag) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
        Edit Product Tag
      </h2>

      <ProductTagForm
        initialData={tag}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
