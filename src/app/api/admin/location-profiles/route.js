import LocationProfile from "@/models/LocationProfile";
import City from "@/models/CityModels";
import Product from "@/models/Product";
import Service from "@/models/Serviceproduct";
import ProductCategory from "@/models/ProductCategory";
import ServiceCategory from "@/models/ServiceCategory";
import { connectDB } from "@/lib/db";

/* =====================================================
   GET ALL (WITH FILTER + PAGINATION)
===================================================== */
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city");
  const scope = searchParams.get("scope");
  const product = searchParams.get("product");
  const service = searchParams.get("service");
  const productCategory = searchParams.get("productCategory");
  const serviceCategory = searchParams.get("serviceCategory");

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const query = {};

  if (city) query.city = city;
  if (scope) query.scope = scope;
  if (product) query.product = product;
  if (service) query.service = service;
  if (productCategory) query.productCategory = productCategory;
  if (serviceCategory) query.serviceCategory = serviceCategory;

  const profiles = await LocationProfile.find(query)
    .populate("city", "name slug")
    .populate("product", "title slug")
    .populate("service", "title slug")
    .populate("productCategory", "name slug")
    .populate("serviceCategory", "name slug")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean(); // 🚀 performance boost

  const total = await LocationProfile.countDocuments(query);

  return Response.json({
    data: profiles,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  });
}

/* =====================================================
   CREATE PROFILE
===================================================== */
/* =====================================================
   CREATE PROFILE
===================================================== */
export async function POST(req) {
  await connectDB();

  const body = await req.json();

  try {
    /* ---------- BASIC REQUIRED CHECK ---------- */
    if (!body.city || !body.scope) {
      return Response.json(
        { error: "City and scope are required" },
        { status: 400 }
      );
    }

    /* ---------- REMOVE EMPTY STRINGS ---------- */
    Object.keys(body).forEach((key) => {
      if (body[key] === "") delete body[key];
    });

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
          { error: "Product is required for product scope" },
          { status: 400 }
        );
      }

      const productExists = await Product.findById(body.product);
      if (!productExists) {
        return Response.json(
          { error: "Invalid product selected" },
          { status: 400 }
        );
      }
    }

    if (body.scope === "service") {
      if (!body.service) {
        return Response.json(
          { error: "Service is required for service scope" },
          { status: 400 }
        );
      }

      const serviceExists = await Service.findById(body.service);
      if (!serviceExists) {
        return Response.json(
          { error: "Invalid service selected" },
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

      const categoryExists = await ProductCategory.findById(body.productCategory);
      if (!categoryExists) {
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

      const categoryExists = await ServiceCategory.findById(body.serviceCategory);
      if (!categoryExists) {
        return Response.json(
          { error: "Invalid service category" },
          { status: 400 }
        );
      }
    }

    /* ---------- CLEAN IRRELEVANT FIELDS ---------- */
    if (body.scope !== "product") delete body.product;
    if (body.scope !== "service") delete body.service;
    if (body.scope !== "productCategory") delete body.productCategory;
    if (body.scope !== "serviceCategory") delete body.serviceCategory;

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

    /* ---------- AUTO SEO FALLBACK ---------- */
    if (!body.seoTitleOverride) {
      body.seoTitleOverride = `${body.scope} rental in city`;
    }

    if (!body.seoDescriptionOverride) {
      body.seoDescriptionOverride =
        "Find best rental services with affordable pricing and quick delivery.";
    }

    /* ---------- CREATE ---------- */
    const profile = await LocationProfile.create(body);

    return Response.json({ data: profile });

  } catch (err) {
    if (err.code === 11000) {
      return Response.json(
        { error: "Profile already exists for this city + target combination" },
        { status: 400 }
      );
    }

    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}