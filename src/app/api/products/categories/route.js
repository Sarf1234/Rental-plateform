import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProductCategory from "@/models/ProductCategory";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const active = searchParams.get("active");

    const filter = {};
    if (active !== "false") filter.isActive = true;

    const categories = await ProductCategory.find(filter)
      .populate("parent", "name slug")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    console.error("GET /api/products/categories error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Category name required" },
        { status: 400 }
      );
    }

    let slug = body.slug
      ? createSlug(body.slug)
      : createSlug(body.name);

    const exists = await ProductCategory.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    const category = await ProductCategory.create({
      name: body.name,
      slug,
      parent: body.parent || null,
      seo: body.seo || {},
      isActive:
        body.isActive === undefined ? true : !!body.isActive,
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/products/categories error:", err);

    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Category slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
