import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ServiceCategory from "@/models/ServiceCategory";

// ✅ GET SINGLE CATEGORY BY SLUG
export async function GET(req, context) {
  try {
    await connectDB();

    const { slug } = await context.params;

    const category = await ServiceCategory.findOne({ slug });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ UPDATE CATEGORY BY SLUG
export async function PUT(req, context) {
  try {
    await connectDB();

    const { slug } = await context.params;
    const body = await req.json();

    if (body.images && body.images.length > 4) {
      return NextResponse.json(
        { success: false, message: "Maximum 4 images allowed" },
        { status: 400 }
      );
    }

    const updated = await ServiceCategory.findOneAndUpdate(
      { slug },
      body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE CATEGORY BY SLUG
export async function DELETE(req, context) {
  try {
    await connectDB();

    const { slug } = await context.params;

    const deleted = await ServiceCategory.findOneAndDelete({ slug });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
