import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ServiceCategory from "@/models/ServiceCategory";

// ✅ GET ALL SERVICE CATEGORIES
export async function GET() {
  try {
    await connectDB();

    const categories = await ServiceCategory.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ CREATE SERVICE CATEGORY
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, slug, description, images, seo } = body;

    // Basic Validation
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }

    if (images && images.length > 4) {
      return NextResponse.json(
        { success: false, message: "Maximum 4 images allowed" },
        { status: 400 }
      );
    }

    const category = await ServiceCategory.create({
      name,
      slug,
      description,
      images,
      seo,
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
