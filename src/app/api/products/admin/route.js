import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductCategory from "@/models/ProductCategory";
import ProductTag from "@/models/ProductTags";
import City from "@/models/CityModels";
import { requireAdmin } from "@/lib/protectRoute";

/* ===========================
   ADMIN - GET ALL PRODUCTS
=========================== */
export async function GET(req) {
  try {
    await requireAdmin(); // 🔐 admin protection
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
    const skip = (page - 1) * limit;

    const status = searchParams.get("status"); // draft / published / archived
    const categorySlug = searchParams.get("category");
    const tagSlug = searchParams.get("tag");
    const citySlug = searchParams.get("city");
    const search = searchParams.get("search");

    const filter = {};
    

    /* ---------- STATUS FILTER ---------- */
    if (status) {
      filter.status = status;
    }

    /* ---------- SEARCH FILTER ---------- */
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    /* ---------- RELATION FILTERS ---------- */
    if (categorySlug) {
      const category = await ProductCategory.findOne({ slug: categorySlug });
      if (category) filter.categories = category._id;
    }

    if (tagSlug) {
      const tag = await ProductTag.findOne({ slug: tagSlug });
      if (tag) filter.tags = tag._id;
    }

    if (citySlug) {
      const city = await City.findOne({ slug: citySlug });
      if (city) filter.serviceAreas = city._id;
    }

    /* ---------- QUERY ---------- */
    const query = Product.find(filter)
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate("serviceAreas", "name slug")
      .sort({ createdAt: -1 });

    const total = await query.clone().countDocuments();

    const products = await query
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: products,
    });

  } catch (err) {
    console.error("ADMIN GET /api/products/admin error:", err);

    return NextResponse.json(
      { success: false, message: "Failed to fetch admin products" },
      { status: 500 }
    );
  }
}
