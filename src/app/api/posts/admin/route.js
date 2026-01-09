import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import Tag from "@/models/Tag";
import { requireAdmin } from "@/lib/protectRoute";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // 🔐 Admin protection
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    const categorySlug = searchParams.get("category");
    const tagsSlugs = searchParams.get("tags");
    const q = searchParams.get("q");
    const status = searchParams.get("status"); 
    // status = published | unpublished | all

    let filter = {};

    // --------------------------------------------
    // STATUS FILTER (ADMIN ONLY)
    // --------------------------------------------
    if (status === "published") filter.published = true;
    if (status === "unpublished") filter.published = false;
    // if "all" → no filter

    // --------------------------------------------
    // CATEGORY FILTER
    // --------------------------------------------
    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug }).lean();
      if (!cat) {
        return NextResponse.json({ success: true, data: [], total: 0 });
      }
      filter.categories = { $in: [cat._id] };
    }

    // --------------------------------------------
    // TAG FILTER
    // --------------------------------------------
    if (tagsSlugs) {
      const slugs = tagsSlugs.split(",").filter(Boolean);
      const tagDocs = await Tag.find({ slug: { $in: slugs } }).lean();
      filter.tags = { $in: tagDocs.map(t => t._id) };
    }

    // --------------------------------------------
    // QUERY
    // --------------------------------------------
    let query = Post.find(filter);

    if (q) {
      query = Post.find({
        $text: { $search: q },
        ...filter,
      });
    }

    // --------------------------------------------
    // SORT
    // --------------------------------------------
    query = query.sort({
      published: 1,     // ❗ drafts first
      isFeatured: -1,   // ⭐ featured next
      isTrending: -1,   // 🔥 trending next
      createdAt: -1,    // 🕒 newest last
    });

    // --------------------------------------------
    // PAGINATION
    // --------------------------------------------
    const skip = (page - 1) * limit;
    const total = await query.clone().countDocuments();

    const posts = await query
      .skip(skip)
      .limit(limit)
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .lean();

    return NextResponse.json({ success: true, data: posts, total });
  } catch (err) {
    console.error("ADMIN POSTS ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
