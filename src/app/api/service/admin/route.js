import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/models/Serviceproduct";
import Business from "@/models/BusinessModel";
import City from "@/models/CityModels";
import { requireAdmin } from "@/lib/protectRoute";

/* ================= ADMIN LIST ================= */
export async function GET(req) {
  try {
    await connectDB();
    await requireAdmin();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const status = searchParams.get("status");
    const provider = searchParams.get("provider");

    const filter = {};
    if (status) filter.status = status;
    if (provider) filter.providers = provider;

    const skip = (page - 1) * limit;

    const total = await Service.countDocuments(filter);

    const services = await Service.find(filter)
      .populate("providers", "name slug phone")
      .populate("serviceAreas", "name slug")
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: services,
      total,
      page,
    });
  } catch (err) {
    console.error("ADMIN GET /api/service/admin", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
