import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/models/Serviceproduct";
import Business from "@/models/BusinessModel";
import City from "@/models/CityModels";
import Product from "@/models/Product";
import { createSlug } from "@/utils/createSlug";
import { requireAdmin } from "@/lib/protectRoute";

/* ================= PUBLIC DETAIL ================= */
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const service = await Service.findOne({
      slug,
    //   status: "published",
    })
      .populate("providers", "name slug phone")
      .populate("products", "title slug")
      .populate("serviceAreas", "name slug")
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

