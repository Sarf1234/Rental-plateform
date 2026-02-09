import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/models/Serviceproduct";
import Business from "@/models/BusinessModel";
import City from "@/models/CityModels";
import Product from "@/models/Product";
import ServiceCategory from "@/models/ServiceCategory";
import { createSlug } from "@/utils/createSlug";
import { requireAdmin } from "@/lib/protectRoute";

/* ================= PUBLIC DETAIL ================= */
export async function GET(req, context) {
  try {
    await connectDB();

    const { params } = await context;
    const { slug } = await params;

    // Await searchParams in Next 16
    const { searchParams } = new URL(req.url);
    const citySlug = searchParams.get("city");

    let city = null;

    if (citySlug) {
      city = await City.findOne({ slug: citySlug }).lean();
    }

    const service = await Service.findOne({ slug })
      .populate("category", "name slug images")
      .populate("serviceAreas", "name slug")
      .populate({
        path: "products",
        match: { status: "published" },
        select: "title slug images pricing highlights status"
      })
      .populate({
        path: "providers",
        match: city
          ? { serviceAreas: city._id, status: "active" }
          : { status: "active" },
        select: "name slug phone serviceAreas isVerified"
      })
      .lean();

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service });

  } catch (err) {
    console.error("GET /api/service/[slug]", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}


/* ================= UPDATE (ADMIN) ================= */
/* ================= UPDATE (ADMIN) ================= */
export async function PUT(req, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const { slug } = await params;
    const body = await req.json();

    const existingService = await Service.findOne({ slug });

    if (!existingService) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    /* ---------- SLUG UPDATE SAFE ---------- */
    if (body.slug) {
      const newSlug = createSlug(body.slug);

      const slugExists = await Service.findOne({
        slug: newSlug,
        _id: { $ne: existingService._id },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, message: "Slug already exists" },
          { status: 409 }
        );
      }

      body.slug = newSlug;
    }

    /* ---------- SAFE FIELD FILTER ---------- */
    const allowedFields = [
      "title",
      "slug",
      "description",
      "serviceType",
      "category",
      "images",
      "serviceAreas",
      "providers",
      "products",
      "pricing",
      "contactMode",
      "whatsappNumber",
      "callNumber",
      "features",
      "serviceProcess",
      "faqs",
      "seo",
      "isFeatured",
      "isTopService",
      "isBestService",
      "priority",
      "status",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    /* ---------- ARRAY SAFETY ---------- */
    updateData.providers = body.providers || [];
    updateData.products = body.products || [];
    updateData.serviceAreas = body.serviceAreas || [];

    const updated = await Service.findByIdAndUpdate(
      existingService._id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("providers", "name slug")
      .populate("products", "title slug")
      .populate("serviceAreas", "name slug");

    return NextResponse.json({ success: true, data: updated });

  } catch (err) {
    console.error("PUT /api/service/[slug]", err);

    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Duplicate slug" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}


/* ================= ARCHIVE (ADMIN) ================= */
/* ================= ARCHIVE (ADMIN) ================= */
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const { slug } = await params;

    const updated = await Service.findOneAndUpdate(
      { slug },
      { status: "archived" },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service archived",
    });

  } catch (err) {
    console.error("DELETE /api/service/[slug]", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

