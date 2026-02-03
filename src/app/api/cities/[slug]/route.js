import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import City from "@/models/CityModels";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";


export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const city = await City.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!city) {
      return NextResponse.json(
        { success: false, message: "City not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: city,
    });
  } catch (err) {
    console.error("GET /api/cities/[slug] error:", err);
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

    const city = await City.findOne({ slug });
    if (!city) {
      return NextResponse.json(
        { success: false, message: "City not found" },
        { status: 404 }
      );
    }

    // slug update
    if (body.slug || body.name || body.state) {
      let newSlug = body.slug
        ? createSlug(body.slug)
        : createSlug(`${body.name || city.name}-${body.state || city.state}`);

      if (newSlug !== city.slug) {
        const exists = await City.findOne({ slug: newSlug });
        if (exists) newSlug = `${newSlug}-${Date.now()}`;
        city.slug = newSlug;
      }
    }

    if (body.name !== undefined) city.name = body.name;
    if (body.state !== undefined) city.state = body.state;
    if (body.seo !== undefined) city.seo = body.seo;
    if (body.geo !== undefined) city.geo = body.geo;
    if (body.isActive !== undefined) city.isActive = !!body.isActive;

    await city.save();

    return NextResponse.json({
      success: true,
      data: city,
      message: "City updated",
    });
  } catch (err) {
    console.error("PUT /api/cities/[slug] error:", err);

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

    const city = await City.findOne({ slug });
    if (!city) {
      return NextResponse.json(
        { success: false, message: "City not found" },
        { status: 404 }
      );
    }

    city.isActive = false;
    await city.save();

    return NextResponse.json({
      success: true,
      message: "City deactivated",
    });
  } catch (err) {
    console.error("DELETE /api/cities/[slug] error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
