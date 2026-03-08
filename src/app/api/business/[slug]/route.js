import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Business from "@/models/BusinessModel";
import City from "@/models/CityModels";
import Product from "@/models/Product";
import Service from "@/models/Serviceproduct";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug required" },
        { status: 400 }
      );
    }

    const business = await Business.findOne({
      slug,
      status: "active",
    })
      .populate("serviceAreas", "name slug")
      .populate("products.product", "title slug images pricing")
      .populate("services.service", "title slug")
      .lean();

    if (!business) {
      return NextResponse.json(
        { success: false, message: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: business,
    });
  } catch (err) {
    console.error("GET /api/business/[slug] error:", err);

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

    const { slug } = await params;
    const body = await req.json();

    const business = await Business.findOne({ slug });

    if (!business) {
      return NextResponse.json(
        { success: false, message: "Business not found" },
        { status: 404 }
      );
    }

    /* ---------- SLUG UPDATE ---------- */

    if (body.slug || body.name) {
      let newSlug = body.slug
        ? createSlug(body.slug)
        : createSlug(body.name);

      if (newSlug !== business.slug) {
        const exists = await Business.findOne({ slug: newSlug });

        if (exists) newSlug = `${newSlug}-${Date.now()}`;

        business.slug = newSlug;
      }
    }

    /* ---------- SERVICE AREAS ---------- */

    if (Array.isArray(body.serviceAreas)) {
      const invalidId = body.serviceAreas.some(
        (id) => !/^[0-9a-fA-F]{24}$/.test(id)
      );

      if (invalidId) {
        return NextResponse.json(
          { success: false, message: "Invalid city id format" },
          { status: 400 }
        );
      }

      const cities = await City.find({
        _id: { $in: body.serviceAreas },
      });

      if (cities.length !== body.serviceAreas.length) {
        return NextResponse.json(
          { success: false, message: "One or more cities not found" },
          { status: 400 }
        );
      }

      business.serviceAreas = body.serviceAreas;
    }

    /* ---------- DUPLICATE PRODUCT CHECK ---------- */

    if (Array.isArray(body.products)) {
      const productIds = body.products.map((p) => p.product?.toString());

      if (new Set(productIds).size !== productIds.length) {
        return NextResponse.json(
          { success: false, message: "Duplicate products not allowed" },
          { status: 400 }
        );
      }

      business.products = body.products;
    }

    /* ---------- DUPLICATE SERVICE CHECK ---------- */

    if (Array.isArray(body.services)) {
      const serviceIds = body.services.map((s) => s.service?.toString());

      if (new Set(serviceIds).size !== serviceIds.length) {
        return NextResponse.json(
          { success: false, message: "Duplicate services not allowed" },
          { status: 400 }
        );
      }

      business.services = body.services;
    }

    /* ---------- BASIC FIELDS ---------- */

    if (body.name !== undefined) business.name = body.name;
    if (body.phone !== undefined) business.phone = body.phone;
    if (body.email !== undefined) business.email = body.email;
    if (body.address !== undefined) business.address = body.address;

    /* ---------- CONTACT ---------- */

    if (body.whatsappNumber !== undefined)
      business.whatsappNumber = body.whatsappNumber;

    if (body.contactPreference !== undefined)
      business.contactPreference = body.contactPreference;

    if (body.website !== undefined) business.website = body.website;

    /* ---------- BUSINESS PROFILE ---------- */

    if (body.intro !== undefined) business.intro = body.intro;
    if (body.description !== undefined) business.description = body.description;
    if (body.experienceYears !== undefined)
      business.experienceYears = body.experienceYears;

    /* ---------- MEDIA ---------- */

    if (body.logo !== undefined) business.logo = body.logo;
    if (body.coverImage !== undefined) business.coverImage = body.coverImage;
    if (body.gallery !== undefined) business.gallery = body.gallery;

    /* ---------- STATS ---------- */

    if (body.totalOrders !== undefined)
      business.totalOrders = body.totalOrders;

    if (body.ratingAvg !== undefined) business.ratingAvg = body.ratingAvg;
    if (body.ratingCount !== undefined)
      business.ratingCount = body.ratingCount;

    /* ---------- PLATFORM FLAGS ---------- */

    if (body.isVerified !== undefined) business.isVerified = !!body.isVerified;
    if (body.isFeatured !== undefined) business.isFeatured = !!body.isFeatured;
    if (body.priority !== undefined) business.priority = body.priority;

    /* ---------- SEO ---------- */

    if (body.seo !== undefined) business.seo = body.seo;

    /* ---------- STATUS ---------- */

    if (body.status !== undefined) business.status = body.status;

    await business.save();

    return NextResponse.json({
      success: true,
      data: business,
      message: "Business updated",
    });
  } catch (err) {
    console.error("PUT /api/business/[slug] error:", err);

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



export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    await connectDB();

    const { slug } = await params;

    const business = await Business.findOne({ slug });
    if (!business) {
      return NextResponse.json(
        { success: false, message: "Business not found" },
        { status: 404 }
      );
    }

    business.status = "inactive";
    await business.save();

    return NextResponse.json({
      success: true,
      message: "Business removed (soft delete)",
    });
  } catch (err) {
    console.error("DELETE /api/business/[slug] error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

