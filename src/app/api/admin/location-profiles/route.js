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

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const query = {};

  if (city) query.city = city;
  if (scope) query.scope = scope;
  if (product) query.product = product;
  if (service) query.service = service;

  const profiles = await LocationProfile.find(query)
    .populate("city", "name slug")
    .populate("product", "title slug")
    .populate("service", "title slug")
    .populate("productCategory", "name slug")
    .populate("serviceCategory", "name slug")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

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
      if (!body.product)
        return Response.json(
          { error: "Product is required for product scope" },
          { status: 400 }
        );

      const productExists = await Product.findById(body.product);
      if (!productExists)
        return Response.json(
          { error: "Invalid product selected" },
          { status: 400 }
        );
    }

    if (body.scope === "service") {
      if (!body.service)
        return Response.json(
          { error: "Service is required for service scope" },
          { status: 400 }
        );

      const serviceExists = await Service.findById(body.service);
      if (!serviceExists)
        return Response.json(
          { error: "Invalid service selected" },
          { status: 400 }
        );
    }

    if (body.scope === "productCategory" && !body.productCategory) {
      return Response.json(
        { error: "ProductCategory required for this scope" },
        { status: 400 }
      );
    }

    if (body.scope === "serviceCategory" && !body.serviceCategory) {
      return Response.json(
        { error: "ServiceCategory required for this scope" },
        { status: 400 }
      );
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