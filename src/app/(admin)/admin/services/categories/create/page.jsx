"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import ServiceCategoryForm from "../../../../../../components/ui/admin/ServiceCategoryForm";

export default function CreateServiceCategoryPage() {
  const router = useRouter();

  async function handleCreate(data) {
            await apiRequest(
        "/api/service-categories",
        "POST",
        data
        );

    toast.success("Category created");
    router.push("/admin/services/categories");
  }

  return (
    <ServiceCategoryForm
      onSubmit={handleCreate}
      buttonText="Create Category"
    />
  );
}
