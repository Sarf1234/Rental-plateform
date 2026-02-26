"use client";

import LocationProfileForm from "@/components/ui/admin/LocationProfileForm";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateLocationProfile() {
  const router = useRouter();

  async function handleCreate(payload) {
    await apiRequest(
      "/api/admin/location-profiles",
      "POST",
      payload
    );
    router.push("/admin/location-profiles");
  }

  return <LocationProfileForm onSubmit={handleCreate} />;
}