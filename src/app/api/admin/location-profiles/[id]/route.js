import LocationProfile from "@/models/LocationProfile";
import City from "@/models/CityModels";
import Product from "@/models/Product";
import Service from "@/models/Serviceproduct";
import ProductCategory from "@/models/ProductCategory";
import ServiceCategory from "@/models/ServiceCategory";
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

    return Response.json({ data: profile });

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
    /* ---------- REMOVE EMPTY STRINGS ---------- */
    Object.keys(body).forEach((key) => {
      if (body[key] === "") delete body[key];
    });

    /* ---------- BASIC VALIDATION ---------- */
    if (!body.city || !body.scope) {
      return Response.json(
        { error: "City and scope are required" },
        { status: 400 }
      );
    }

    /* ---------- CITY VALIDATION ---------- */
    const cityExists = await City.findById(body.city);
    if (!cityExists) {
      return Response.json(
        { error: "Invalid city selected" },
        { status: 400 }
      );
    }

    /* ---------- TARGET VALIDATION ---------- */

    if (body.scope === "product") {
      if (!body.product) {
        return Response.json(
          { error: "Product is required" },
          { status: 400 }
        );
      }

      const exists = await Product.findById(body.product);
      if (!exists) {
        return Response.json(
          { error: "Invalid product" },
          { status: 400 }
        );
      }
    }

    if (body.scope === "service") {
      if (!body.service) {
        return Response.json(
          { error: "Service is required" },
          { status: 400 }
        );
      }

      const exists = await Service.findById(body.service);
      if (!exists) {
        return Response.json(
          { error: "Invalid service" },
          { status: 400 }
        );
      }
    }

    if (body.scope === "productCategory") {
      if (!body.productCategory) {
        return Response.json(
          { error: "ProductCategory required" },
          { status: 400 }
        );
      }

      const exists = await ProductCategory.findById(body.productCategory);
      if (!exists) {
        return Response.json(
          { error: "Invalid product category" },
          { status: 400 }
        );
      }
    }

    if (body.scope === "serviceCategory") {
      if (!body.serviceCategory) {
        return Response.json(
          { error: "ServiceCategory required" },
          { status: 400 }
        );
      }

      const exists = await ServiceCategory.findById(body.serviceCategory);
      if (!exists) {
        return Response.json(
          { error: "Invalid service category" },
          { status: 400 }
        );
      }
    }

    /* ---------- FAQ VALIDATION ---------- */
    if (body.faq) {
      if (!Array.isArray(body.faq)) {
        return Response.json(
          { error: "FAQ must be an array" },
          { status: 400 }
        );
      }

      for (const item of body.faq) {
        if (!item.question || !item.answer) {
          return Response.json(
            { error: "Each FAQ must have question and answer" },
            { status: 400 }
          );
        }
      }
    }

    /* ---------- CLEAN TARGET FIELDS ---------- */
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
      faq: body.faq,
    };

    const unsetData = {
      product: "",
      service: "",
      productCategory: "",
      serviceCategory: "",
    };

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

    /* ---------- SEO FALLBACK ---------- */
    if (!setData.seoTitleOverride) {
      setData.seoTitleOverride = `${body.scope} rental in city`;
    }

    if (!setData.seoDescriptionOverride) {
      setData.seoDescriptionOverride =
        "Find best rental services with affordable pricing and quick delivery.";
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

  try {
    const deleted = await LocationProfile.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });

  } catch (err) {
    return Response.json(
      { error: "Invalid profile ID" },
      { status: 400 }
    );
  }
}