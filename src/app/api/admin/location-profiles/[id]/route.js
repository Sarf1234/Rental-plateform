import LocationProfile from "@/models/LocationProfile";
import { connectDB } from "@/lib/db";

/* ================= GET SINGLE ================= */
export async function GET(req, { params }) {
  await connectDB();

  const { id } = await params;

  try {
    const profile = await LocationProfile.findById(id)
      .populate("city")
      .populate("product")
      .populate("service")
      .populate("productCategory")
      .populate("serviceCategory")
      .lean();

    if (!profile) {
      return Response.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return Response.json({
      data: profile,
    });

  } catch (err) {
    return Response.json(
      { error: "Invalid profile ID" },
      { status: 400 }
    );
  }
}

/* ================= UPDATE ================= */
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  try {
    const setData = {
      city: body.city,
      scope: body.scope,
      priceMultiplier: body.priceMultiplier,
      demandLevel: body.demandLevel,
      customIntro: body.customIntro,
      seasonalNote: body.seasonalNote,
      deliveryNote: body.deliveryNote,
      trendingText: body.trendingText,
      expressAvailable: body.expressAvailable,
      seoTitleOverride: body.seoTitleOverride,
      seoDescriptionOverride: body.seoDescriptionOverride,
      additionalContent: body.additionalContent,
    };

    // Always remove all target refs first
    const unsetData = {
      product: "",
      service: "",
      productCategory: "",
      serviceCategory: "",
    };

    // Then set only the correct one
    if (body.scope === "product") {
      setData.product = body.product;
      delete unsetData.product;
    }

    if (body.scope === "service") {
      setData.service = body.service;
      delete unsetData.service;
    }

    if (body.scope === "productCategory") {
      setData.productCategory = body.productCategory;
      delete unsetData.productCategory;
    }

    if (body.scope === "serviceCategory") {
      setData.serviceCategory = body.serviceCategory;
      delete unsetData.serviceCategory;
    }

    const updated = await LocationProfile.findByIdAndUpdate(
      id,
      {
        $set: setData,
        $unset: unsetData,
      },
      { new: true, runValidators: true }
    );

    return Response.json({ data: updated });

  } catch (err) {
    console.error("UPDATE ERROR:", err);

    if (err.code === 11000) {
      return Response.json(
        { error: "Duplicate profile conflict" },
        { status: 400 }
      );
    }

    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;

  await LocationProfile.findByIdAndDelete(id);

  return Response.json({ success: true });
}