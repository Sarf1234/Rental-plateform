import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Business from "@/models/BusinessModel";
import City from "@/models/CityModels";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    const city = searchParams.get("city"); // city slug or id
    const status = searchParams.get("status") || "active";
    const q = searchParams.get("q");

    const filter = { status };

    // Search by business name
    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }

    // Filter by service area
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
        "name slug phone email address isVerified status serviceAreas createdAt"
      )
      .populate("serviceAreas", "name slug")
      .sort({ isVerified: -1, createdAt: -1 })
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
    // permission first (important)
    await requireAdmin();
    await connectDB();

    const body = await req.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 }
      );
    }

    // slug
    let slug = body.slug
      ? createSlug(body.slug)
      : createSlug(body.name);

    const exists = await Business.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    // validate service areas
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

    const business = await Business.create({
      name: body.name,
      slug,
      phone: body.phone,
      email: body.email || "",
      address: body.address || {},
      serviceAreas,
      isVerified: !!body.isVerified,
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
