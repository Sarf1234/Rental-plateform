"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LocationProfileForm from "@/components/ui/admin/LocationProfileForm";
import { apiRequest } from "@/lib/api";

export default function EditLocationProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    apiRequest(`/api/admin/location-profiles/${id}`)
      .then((res) => setData(res.data))
      .catch(() => router.push("/admin/location-profiles"));
  }, [id]);

  async function handleUpdate(payload) {
    await apiRequest(
      `/api/admin/location-profiles/${id}`,
      "PUT",
      payload
    );
    router.push("/admin/location-profiles");
  }

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <LocationProfileForm
      initialData={data}
      onSubmit={handleUpdate}
    />
  );
}