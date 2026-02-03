import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Business from "@/models/BusinessModel";
import City from "@/models/CityModels";
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

    // slug update
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

    // validate service areas
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

    // update fields
    if (body.name !== undefined) business.name = body.name;
    if (body.phone !== undefined) business.phone = body.phone;
    if (body.email !== undefined) business.email = body.email;
    if (body.address !== undefined) business.address = body.address;
    if (body.isVerified !== undefined) business.isVerified = !!body.isVerified;
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

