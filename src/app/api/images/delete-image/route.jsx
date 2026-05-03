import { deleteImage } from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const { public_id } = await req.json();

    if (!public_id) {
      return Response.json({ error: "Missing public_id" }, { status: 400 });
    }

    await deleteImage(public_id);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}