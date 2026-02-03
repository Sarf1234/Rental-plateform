import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import City from "@/models/CityModels";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const q = searchParams.get("q");
    const state = searchParams.get("state");
    const active = searchParams.get("active");

    const filter = {};

    // active by default
    filter.isActive = active === "false" ? false : true;

    // search
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { state: { $regex: q, $options: "i" } },
      ];
    }

    if (state) {
      filter.state = state;
    }

    const skip = (page - 1) * limit;

    const total = await City.countDocuments(filter);

    const cities = await City.find(filter)
      .select("name slug state seo isActive createdAt")
      .sort({ state: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: cities,
      total,
    });
  } catch (err) {
    console.error("GET /api/cities error:", err);
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

    if (!body.name || !body.state) {
      return NextResponse.json(
        { success: false, message: "City name and state are required" },
        { status: 400 }
      );
    }

    let slug = body.slug
      ? createSlug(body.slug)
      : createSlug(`${body.name}-${body.state}`);

    const exists = await City.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    const city = await City.create({
      name: body.name,
      slug,
      state: body.state,

      seo: body.seo || {},
      geo: body.geo || {},

      isActive:
        body.isActive === undefined ? true : !!body.isActive,
    });

    return NextResponse.json(
      {
        success: true,
        data: city,
        message: "City created successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/cities error:", err);

    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "City slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
