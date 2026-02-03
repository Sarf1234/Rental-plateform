import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/models/Serviceproduct";
import { createSlug } from "@/utils/createSlug";
import { requireAdmin } from "@/lib/protectRoute";
import City from "@/models/CityModels";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const citySlug = searchParams.get("city");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    if (!citySlug) {
      return NextResponse.json(
        { success: false, message: "City is required" },
        { status: 400 }
      );
    }

    /* ---------- FIND CITY ---------- */
    const city = await City.findOne({
      slug: citySlug,
      isActive: true,
    }).lean();

    if (!city) {
      return NextResponse.json(
        { success: false, message: "City not found" },
        { status: 404 }
      );
    }

    const baseFilter = {
      status: "published",
      serviceAreas: { $in: [city._id] },
    };

    /* ---------- PARALLEL QUERIES ---------- */
    const [
      featured,
      top,
      best,
      allServices,
      totalAll
    ] = await Promise.all([

      // Featured (limit 6)
      Service.find({ ...baseFilter, isFeatured: true })
        .sort({ priority: -1 })
        .limit(6)
        .lean(),

      // Top (limit 6)
      Service.find({ ...baseFilter, isTopService: true })
        .sort({ priority: -1 })
        .limit(6)
        .lean(),

      // Best (limit 6)
      Service.find({ ...baseFilter, isBestService: true })
        .sort({ priority: -1 })
        .limit(6)
        .lean(),

      // All (Paginated)
      Service.find(baseFilter)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Service.countDocuments(baseFilter),
    ]);

    return NextResponse.json({
      success: true,
      city,
      featured,
      top,
      best,
      all: {
        data: allServices,
        pagination: {
          total: totalAll,
          page,
          pages: Math.ceil(totalAll / limit),
          limit,
        },
      },
    });

  } catch (error) {
    console.error("HOME SERVICE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}



/* ================= CREATE (ADMIN) ================= */
export async function POST(req) {
  try {
    await connectDB();
    await requireAdmin();

    const body = await req.json();

    /* ---------- VALIDATION ---------- */
    if (
      !body.title ||
      !body.description ||
      !Array.isArray(body.providers) ||
      body.providers.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    /* ---------- SLUG GENERATION ---------- */
    let slug = body.slug
      ? createSlug(body.slug)
      : createSlug(body.title);

    const exists = await Service.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    /* ---------- CLEAN ARRAY SAFETY ---------- */
    const service = await Service.create({
      ...body,
      slug,
      providers: body.providers || [],
      products: body.products || [],
      serviceAreas: body.serviceAreas || [],
    });

    return NextResponse.json(
      { success: true, data: service },
      { status: 201 }
    );

  } catch (err) {
    console.error("POST /api/service", err);

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

