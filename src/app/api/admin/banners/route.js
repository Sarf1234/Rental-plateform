import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import City from "@/models/CityModels";
import Banner from "@/models/Banner";

export async function GET() {
  try {
    await connectDB();

    const banners = await Banner.find()
      .populate("city", "name slug")
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch banners",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const banner = await Banner.create(body);

    return NextResponse.json({
      success: true,
      data: banner,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Banner creation failed",
      },
      {
        status: 500,
      }
    );
  }
}