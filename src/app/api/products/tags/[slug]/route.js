import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProductTag from "@/models/ProductTags";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params; // ✅ Next.js 16

    const tag = await ProductTag.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!tag) {
      return NextResponse.json(
        { success: false, message: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch (err) {
    console.error("GET product tag error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}


export async function PUT(req, { params }) {
  try {
    await requireAdmin();
    await connectDB();

    const { slug } = await params; // ✅ Next.js 16
    const body = await req.json();

    const tag = await ProductTag.findOne({ slug });
    if (!tag) {
      return NextResponse.json(
        { success: false, message: "Tag not found" },
        { status: 404 }
      );
    }

    if (body.name) tag.name = body.name;
    if (body.slug) tag.slug = createSlug(body.slug);
    if (body.seo) tag.seo = body.seo;
    if (body.isActive !== undefined)
      tag.isActive = !!body.isActive;

    await tag.save();

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch (err) {
    console.error("PUT product tag error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    await connectDB();

    const { slug } = await params; // ✅ Next.js 16

    const tag = await ProductTag.findOne({ slug });
    if (!tag) {
      return NextResponse.json(
        { success: false, message: "Tag not found" },
        { status: 404 }
      );
    }

    tag.isActive = false;
    await tag.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE product tag error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
