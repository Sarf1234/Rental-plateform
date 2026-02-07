"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import ServiceCategoryForm from "../../../../../../../components/ui/admin/ServiceCategoryForm";

export default function EditServiceCategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest(`/api/service-categories/${slug}`);
        setData(res.data);
      } catch {
        toast.error("Failed to load category");
      }
    }
    load();
  }, [slug]);

  async function handleUpdate(payload) {
    await apiRequest(
    `/api/service-categories/${slug}`,
    "PUT",
    payload
    );

    toast.success("Category updated");
    router.push("/admin/services/categories");
  }

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <ServiceCategoryForm
      initialData={data}
      onSubmit={handleUpdate}
      buttonText="Update Category"
    />
  );
}
