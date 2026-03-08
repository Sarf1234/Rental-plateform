import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Business from "@/models/BusinessModel";
import City from "@/models/CityModels";
import Product from "@/models/Product";
import Service from "@/models/Serviceproduct";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    const city = searchParams.get("city");
    const status = searchParams.get("status") || "active";
    const q = searchParams.get("q");

    const filter = { status };

    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }

    if (city) {
      const cityDoc = await City.findOne({
        $or: [{ slug: city }, { _id: city }],
      }).lean();

      if (!cityDoc) {
        return NextResponse.json({ success: true, data: [], total: 0 });
      }

      filter.serviceAreas = { $in: [cityDoc._id] };
    }

    const skip = (page - 1) * limit;

    const total = await Business.countDocuments(filter);

    const businesses = await Business.find(filter)
      .select(
        "name slug phone email logo ratingAvg totalOrders isVerified status serviceAreas createdAt"
      )
      .populate("serviceAreas", "name slug")
      .sort({
        isFeatured: -1,
        priority: -1,
        isVerified: -1,
        ratingAvg: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: businesses,
      total,
    });
  } catch (err) {
    console.error("GET /api/business error:", err);
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

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 }
      );
    }

    /* ---------- SLUG ---------- */

    let slug = body.slug ? createSlug(body.slug) : createSlug(body.name);

    const exists = await Business.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    /* ---------- SERVICE AREAS VALIDATION ---------- */

    const serviceAreas = Array.isArray(body.serviceAreas)
      ? body.serviceAreas
      : [];

    if (serviceAreas.length) {
      const invalidId = serviceAreas.some(
        (id) => !/^[0-9a-fA-F]{24}$/.test(id)
      );

      if (invalidId) {
        return NextResponse.json(
          { success: false, message: "Invalid city id format" },
          { status: 400 }
        );
      }

      const cities = await City.find({ _id: { $in: serviceAreas } });

      if (cities.length !== serviceAreas.length) {
        return NextResponse.json(
          { success: false, message: "One or more cities not found" },
          { status: 400 }
        );
      }
    }

    /* ---------- PRODUCTS ---------- */

    let products = Array.isArray(body.products) ? body.products : [];

    const productIds = products.map((p) => p.product?.toString());

    if (new Set(productIds).size !== productIds.length) {
      return NextResponse.json(
        { success: false, message: "Duplicate products not allowed" },
        { status: 400 }
      );
    }

    /* ---------- SERVICES ---------- */

    let services = Array.isArray(body.services) ? body.services : [];

    const serviceIds = services.map((s) => s.service?.toString());

    if (new Set(serviceIds).size !== serviceIds.length) {
      return NextResponse.json(
        { success: false, message: "Duplicate services not allowed" },
        { status: 400 }
      );
    }

    /* ---------- CREATE BUSINESS ---------- */

    const business = await Business.create({
      name: body.name,
      slug,

      phone: body.phone,
      email: body.email || "",

      whatsappNumber: body.whatsappNumber || "",
      contactPreference: body.contactPreference || "both",
      website: body.website || "",

      address: body.address || {},

      serviceAreas,

      intro: body.intro || "",
      description: body.description || "",
      experienceYears: body.experienceYears || 0,

      logo: body.logo || "",
      coverImage: body.coverImage || "",
      gallery: body.gallery || [],

      products,
      services,

      totalOrders: body.totalOrders || 0,

      ratingAvg: body.ratingAvg || 0,
      ratingCount: body.ratingCount || 0,

      isVerified: !!body.isVerified,
      isFeatured: !!body.isFeatured,

      priority: body.priority || 0,

      seo: body.seo || {},

      status: body.status || "active",
    });

    return NextResponse.json(
      {
        success: true,
        data: business,
        message: "Business created successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/business error:", err);

    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Business slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
