import { getAllImages } from "@/lib/cloudinary";

export async function GET() {
  try {
    const images = await getAllImages();
    return Response.json(images);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}