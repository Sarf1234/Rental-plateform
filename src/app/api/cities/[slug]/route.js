import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import City from "@/models/CityModels";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";
import LocationProfile from "@/models/LocationProfile";

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

    // 🔥 Fetch City-Level LocationProfile
    const cityProfile = await LocationProfile.findOne({
      city: city._id,
      scope: "city",
    }).lean();


    return NextResponse.json({
      success: true,
      data: city,
      locationContext: cityProfile
        ? {
            customIntro: cityProfile.customIntro,
            seasonalNote: cityProfile.seasonalNote,
            deliveryNote: cityProfile.deliveryNote,
            trendingText: cityProfile.trendingText,
            expressAvailable: cityProfile.expressAvailable,
            demandLevel: cityProfile.demandLevel,
            seoTitleOverride: cityProfile.seoTitleOverride,
            seoDescriptionOverride:
              cityProfile.seoDescriptionOverride,
              faq: cityProfile.faq || [],
          }
        : null,
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

    if (body.name !== undefined) city.name = body.name;
    if (body.state !== undefined) city.state = body.state;

   if (body.footer !== undefined) {
  if (!city.footer) {
    city.footer = {};
  }

  city.footer = {
    ...city.footer,
    ...body.footer,
  };

  city.markModified("footer");
}

    if (body.seo !== undefined) {
      city.seo = body.seo;
      city.markModified("seo");
    }

    if (body.geo !== undefined) {
      city.geo = body.geo;
      city.markModified("geo");
    }

    if (body.isActive !== undefined) {
      city.isActive = !!body.isActive;
    }

    if (Array.isArray(body.subAreas)) {
      city.subAreas = body.subAreas.map((a) => ({
        name: a.name?.trim(),
        isActive: a.isActive !== false,
        priority: a.priority ?? 0,
      }));
      city.markModified("subAreas");
    }

    await city.save();

    return NextResponse.json({
      success: true,
      data: city,
      message: "City updated",
    });
  } catch (err) {
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
        { status: 404 },
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
      { status: 500 },
    );
  }
}
