import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProductTag from "@/models/ProductTags";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const active = searchParams.get("active");

    const filter = {};
    if (active !== "false") filter.isActive = true;

    const tags = await ProductTag.find(filter)
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (err) {
    console.error("GET /api/products/tags error:", err);
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
        { success: false, message: "Tag name required" },
        { status: 400 }
      );
    }

    let slug = body.slug
      ? createSlug(body.slug)
      : createSlug(body.name);

    const exists = await ProductTag.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    const tag = await ProductTag.create({
      name: body.name,
      slug,
      seo: body.seo || {},
      isActive:
        body.isActive === undefined ? true : !!body.isActive,
    });

    return NextResponse.json(
      { success: true, data: tag },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/products/tags error:", err);

    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Tag slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
