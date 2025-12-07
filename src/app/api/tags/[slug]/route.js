import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Tag from "@/models/Tag";
import Category from "@/models/Category";


export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;

    // Find tag by slug
    const tag = await Tag.findOne({ slug });
    if (!tag) return new Response(JSON.stringify({ success: false, message: "Tag not found" }), { status: 404 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const skip = (page - 1) * limit;

    const filter = { published: true, tags: tag._id };

    const posts = await Post.find(filter)
      .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("categories")
      .populate("tags")
      .lean();

    const total = await Post.countDocuments(filter);

    return new Response(JSON.stringify({ success: true, data: posts, total, tag }), { status: 200 });
  } catch (err) {
    console.error("GET /api/posts/tag/[slug] error:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
