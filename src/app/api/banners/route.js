import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import City from "@/models/CityModels";
import Banner from "@/models/Banner";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(req.url);

    const placement =
      searchParams.get("placement");

    const citySlug =
      searchParams.get("city");

    let cityId = null;

    if (citySlug) {
      const city =
        await City.findOne({
          slug: citySlug,
        }).select("_id");

      cityId = city?._id || null;
    }

    let banners = [];

    /* CITY */

    if (cityId) {
      banners = await Banner.find({
        placement,
        city: cityId,
        isActive: true,
      })
        .sort({
          displayOrder: 1,
        })
        .lean();
    }

    /* FALLBACK */

    if (!banners.length) {
      banners = await Banner.find({
        placement,
        city: null,
        isActive: true,
      })
        .sort({
          displayOrder: 1,
        })
        .lean();
    }

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch banners",
      },
      {
        status: 500,
      }
    );
  }
}