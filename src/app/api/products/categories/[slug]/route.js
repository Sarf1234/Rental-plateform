import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProductCategory from "@/models/ProductCategory";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";

export async function GET(req, { params }) {
  try {
    await connectDB();

     const { slug } = await params; // ✅ REQUIRED in Next.js 16

    const category = await ProductCategory.findOne({
      slug,
      isActive: true,
    })
      .populate("parent", "name slug")
      .lean();

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (err) {
    console.error(
      "GET /api/products/categories/[slug] error:",
      err
    );
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

    const body = await req.json();
    const { slug } = await params; // ✅ REQUIRED in Next.js 16

    const category = await ProductCategory.findOne({
      slug,
      isActive: true,
    })

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    if (body.name) category.name = body.name;
    if (body.slug)
      category.slug = createSlug(body.slug);
    if (body.parent !== undefined)
      category.parent = body.parent || null;
    if (body.seo) category.seo = body.seo;
    if (body.isActive !== undefined)
      category.isActive = !!body.isActive;

    await category.save();

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (err) {
    console.error(
      "PUT /api/products/categories/[slug] error:",
      err
    );
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

    const { slug } = await params; // ✅ REQUIRED in Next.js 16

    const category = await ProductCategory.findOne({
      slug,
      isActive: true,
    })

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    category.isActive = false;
    await category.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(
      "DELETE /api/products/categories/[slug] error:",
      err
    );
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
