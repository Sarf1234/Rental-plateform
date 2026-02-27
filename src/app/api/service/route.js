import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/models/Serviceproduct";
import { createSlug } from "@/utils/createSlug";
import { requireAdmin } from "@/lib/protectRoute";
import City from "@/models/CityModels";
import LocationProfile from "@/models/LocationProfile";


export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const citySlug = searchParams.get("city");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    if (!citySlug) {
      return NextResponse.json(
        { success: false, message: "City is required" },
        { status: 400 }
      );
    }

    /* ---------- FIND CITY ---------- */
    const city = await City.findOne({
      slug: citySlug,
      isActive: true,
    }).lean();

    if (!city) {
      return NextResponse.json(
        { success: false, message: "City not found" },
        { status: 404 }
      );
    }

    const baseFilter = {
      status: "published",
      serviceAreas: { $in: [city._id] },
    };

    /* ---------- FETCH SERVICES ---------- */
    const [featured, top, best, allServices, totalAll] =
      await Promise.all([
        Service.find({ ...baseFilter, isFeatured: true })
          .sort({ priority: -1 })
          .limit(6)
          .lean(),

        Service.find({ ...baseFilter, isTopService: true })
          .sort({ priority: -1 })
          .limit(6)
          .lean(),

        Service.find({ ...baseFilter, isBestService: true })
          .sort({ priority: -1 })
          .limit(6)
          .lean(),

        Service.find(baseFilter)
          .sort({ priority: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Service.countDocuments(baseFilter),
      ]);

    /* ---------- FETCH SERVICE-LEVEL MULTIPLIERS ---------- */
    const serviceIds = [
      ...featured,
      ...top,
      ...best,
      ...allServices,
    ].map((s) => s._id);

    const serviceProfiles = await LocationProfile.find({
      city: city._id,
      scope: "service",
      service: { $in: serviceIds },
    }).lean();

    const profileMap = new Map(
      serviceProfiles.map((p) => [p.service.toString(), p])
    );

    /* ---------- APPLY MULTIPLIER PER SERVICE ---------- */
    function applyServiceMultiplier(items) {
      return items.map((item) => {
        const profile = profileMap.get(item._id.toString());

        if (!profile?.priceMultiplier || profile.priceMultiplier === 1) {
          return item; // no change
        }

        if (!item.pricing?.amount) return item;

        const newAmount = Math.round(
          item.pricing.amount * profile.priceMultiplier
        );

        return {
          ...item,
          pricing: {
            ...item.pricing,
            amount: newAmount,
            label: `Starting from ₹${newAmount.toLocaleString()}`,
          },
        };
      });
    }

    const adjustedFeatured = applyServiceMultiplier(featured);
    const adjustedTop = applyServiceMultiplier(top);
    const adjustedBest = applyServiceMultiplier(best);
    const adjustedAll = applyServiceMultiplier(allServices);

    /* ---------- RESPONSE ---------- */
    return NextResponse.json({
      success: true,

      city: {
        ...city,
        locationContext: null, // no city-level multiplier anymore
      },

      featured: adjustedFeatured,
      top: adjustedTop,
      best: adjustedBest,

      all: {
        data: adjustedAll,
        pagination: {
          total: totalAll,
          page,
          pages: Math.ceil(totalAll / limit),
          limit,
        },
      },
    });
  } catch (error) {
    console.error("CITY SERVICE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

/* ================= CREATE (ADMIN) ================= */
export async function POST(req) {
  try {
    await connectDB();
    await requireAdmin();

    const body = await req.json();

    /* ---------- VALIDATION ---------- */
    if (
      !body.title ||
      !body.description ||
      !body.category ||
      !Array.isArray(body.providers) ||
      body.providers.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 },
      );
    }

    /* ---------- SLUG GENERATION ---------- */
    let slug = body.slug ? createSlug(body.slug) : createSlug(body.title);

    const exists = await Service.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    /* ---------- CLEAN ARRAY SAFETY ---------- */
    const service = await Service.create({
      ...body,
      slug,
      providers: body.providers || [],
      products: body.products || [],
      serviceAreas: body.serviceAreas || [],
    });

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (err) {
    console.error("POST /api/service", err);

    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Duplicate slug" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
