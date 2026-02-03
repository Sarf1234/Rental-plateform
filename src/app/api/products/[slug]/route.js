import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductCategory from "@/models/ProductCategory";
import ProductTag from "@/models/ProductTags";
import City from "@/models/CityModels";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";

/* =======================
   GET PRODUCT BY SLUG
======================= */
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;

    const { searchParams } = new URL(req.url);
    const isAdminPreview = searchParams.get("admin") === "true";

    const filter = { slug };

    // Public safety
    // if (!isAdminPreview) {
    //   filter.status = "published";
    // }

    const product = await Product.findOne(filter)
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate("serviceAreas", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.error("GET /api/products/[slug] error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/* =======================
   UPDATE PRODUCT (ADMIN)
======================= */
export async function PUT(req, { params }) {
  try {
    await requireAdmin();
    await connectDB();

    const { slug } = await params;
    const body = await req.json();

    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    /* ---------- SLUG UPDATE (SAFE) ---------- */
    if (body.slug) {
      const newSlug = createSlug(body.slug);
      const exists = await Product.findOne({
        slug: newSlug,
        _id: { $ne: product._id },
      });
      if (exists) {
        return NextResponse.json(
          { success: false, message: "Slug already in use" },
          { status: 409 }
        );
      }
      product.slug = newSlug;
    }

    /* ---------- BASIC FIELDS ---------- */
    if (body.title) product.title = body.title;
    if (body.description) product.description = body.description;
    if (body.images) product.images = body.images;
    if (body.categories) product.categories = body.categories;
    if (body.tags) product.tags = body.tags;
    if (body.pricing) product.pricing = body.pricing;
    if (body.serviceAreas) product.serviceAreas = body.serviceAreas;
    if (body.faqs) product.faqs = body.faqs;
    if (body.termsAndConditions)
      product.termsAndConditions = body.termsAndConditions;
    if (body.seo) product.seo = body.seo;
    if (body.status) product.status = body.status;

    /* ---------- HIGHLIGHTS ---------- */
    if (body.highlights) {
      product.highlights = {
        ...product.highlights,
        ...body.highlights,
      };
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    console.error("PUT /api/products/[slug] error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

/* =======================
   DELETE PRODUCT (SOFT)
======================= */
export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    await connectDB();

    const { slug } = await params;

    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    product.status = "archived";
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product archived successfully",
    });
  } catch (err) {
    console.error("DELETE /api/products/[slug] error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
