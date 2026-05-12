import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Banner from "@/models/Banner";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const banner = await Banner.findById(id)
      .populate("city", "name slug");

    if (!banner) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch banner",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const banner =
      await Banner.findByIdAndUpdate(
        id,
        body,
        {
          new: true,
        }
      );

    if (!banner) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Banner update failed",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req,
  { params }
) {
  try {
    await connectDB();

    const { id } = await params;

    const deletedBanner =
      await Banner.findByIdAndDelete(id);

    if (!deletedBanner) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}