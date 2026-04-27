import { apiRequest } from "@/lib/api";

export async function getCities() {
  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities?page=1&limit=100`
    );

    return res?.data || [];
  } catch (error) {
    console.error("Cities fetch failed", error);
    return [];
  }
}