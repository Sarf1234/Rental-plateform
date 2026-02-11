import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ServiceCategory from "@/models/ServiceCategory";
import Service from "@/models/Serviceproduct";
import City from '@/models/CityModels'


export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params; // category slug
    const { searchParams } = new URL(req.url);
    const citySlug = searchParams.get("city");

    if (!citySlug) {
      return NextResponse.json(
        { success: false, message: "City is required" },
        { status: 400 }
      );
    }

    const city = await City.findOne({ slug: citySlug });
    if (!city) {
      return NextResponse.json(
        { success: false, message: "City not found" },
        { status: 404 }
      );
    }

    const category = await ServiceCategory.findOne({
      slug,
      isActive: true,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const services = await Service.find({
      category: category._id,
      serviceAreas: city._id,
      status: "published",
    })
      .select("title slug images pricing isFeatured priority")
      .sort({ isFeatured: -1, priority: -1 });

    return NextResponse.json({
      success: true,
      data: services,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
