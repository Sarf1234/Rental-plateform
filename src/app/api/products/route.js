import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductCategory from "@/models/ProductCategory";
import ProductTag from "@/models/ProductTags";
import City from "@/models/CityModels";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";
import LocationProfile from "@/models/LocationProfile";

/* =======================
   GET PRODUCTS
======================= */

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const citySlug = searchParams.get("city");
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category");
    const tags = searchParams.get("tags");
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const sort = searchParams.get("sort");

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;

    let city = null;

    const baseFilter = {
      status: "published",
    };

    /* ================= CITY ================= */
    if (citySlug) {
      city = await City.findOne({
        slug: citySlug,
        isActive: true,
      }).lean();

      if (!city) {
        return NextResponse.json(
          { success: false, message: "City not found" },
          { status: 404 }
        );
      }

      baseFilter.serviceAreas = city._id;
    }

    const isFilterMode =
      q || category || tags || min || max || sort;

    /* ===================================================
       HOMEPAGE MODE
    =================================================== */
    if (citySlug && !isFilterMode) {

      const [
        featured,
        top,
        best,
        newProducts,
        allProducts,
        totalAll,
      ] = await Promise.all([

        Product.find({ ...baseFilter, "highlights.isFeatured": true })
          .limit(6)
          .lean(),

        Product.find({ ...baseFilter, "highlights.isTopRented": true })
          .limit(6)
          .lean(),

        Product.find({ ...baseFilter, "highlights.isBestDeal": true })
          .limit(6)
          .lean(),

        Product.find({ ...baseFilter, "highlights.isNewProduct": true })
          .limit(6)
          .lean(),

        Product.find(baseFilter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Product.countDocuments(baseFilter),
      ]);

      const allFetched = [
        ...featured,
        ...top,
        ...best,
        ...newProducts,
        ...allProducts,
      ];

      const adjusted = await applyMultiplier(allFetched, city);

      return NextResponse.json({
        success: true,
        mode: "homepage",
        city,
        featured: adjusted.slice(0, featured.length),
        top: adjusted.slice(featured.length, featured.length + top.length),
        best: adjusted.slice(featured.length + top.length, featured.length + top.length + best.length),
        new: adjusted.slice(featured.length + top.length + best.length, featured.length + top.length + best.length + newProducts.length),
        all: {
          data: adjusted.slice(featured.length + top.length + best.length + newProducts.length),
          pagination: {
            total: totalAll,
            page,
            pages: Math.ceil(totalAll / limit),
            limit,
          },
        },
      });
    }

    /* ===================================================
       SEARCH MODE
    =================================================== */

    if (q) {
      baseFilter.$or = [
        { productCode: q },
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      const categoryDoc = await ProductCategory.findOne({
        slug: category,
        isActive: true,
      }).lean();

      if (!categoryDoc) {
        return NextResponse.json(
          { success: false, message: "Category not found" },
          { status: 404 }
        );
      }

      baseFilter.categories = categoryDoc._id;
    }

    if (tags) {
      const tagSlugs = tags.split(",");

      const tagDocs = await ProductTag.find({
        slug: { $in: tagSlugs },
        isActive: true,
      }).lean();

      if (tagDocs.length > 0) {
        baseFilter.tags = {
          $in: tagDocs.map((t) => t._id),
        };
      }
    }

    if (min || max) {
      baseFilter["pricing.minPrice"] = {};
      if (min) baseFilter["pricing.minPrice"].$gte = Number(min);
      if (max) baseFilter["pricing.minPrice"].$lte = Number(max);
    }

    const sortMap = {
      price_asc: { "pricing.minPrice": 1 },
      price_desc: { "pricing.minPrice": -1 },
      newest: { createdAt: -1 },
      top: { "highlights.isTopRented": -1 },
      featured: { "highlights.isFeatured": -1 },
    };

    const sortOption = sortMap[sort] || { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(baseFilter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("categories tags")
        .lean(),

      Product.countDocuments(baseFilter),
    ]);

    const adjustedProducts = await applyMultiplier(products, city);

    return NextResponse.json({
      success: true,
      mode: "search",
      city,
      data: adjustedProducts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });

  } catch (error) {
    console.error("PRODUCT API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

/* ================= MULTIPLIER LOGIC ================= */

async function applyMultiplier(products, city) {
  if (!city || !products?.length) return products;

  const productIds = products.map((p) => p._id);

  const profiles = await LocationProfile.find({
    city: city._id,
    scope: { $in: ["product", "city"] }, // backward compatible
    product: { $in: productIds },
  }).lean();

  let cityMultiplier = null;
  const productMap = new Map();

  profiles.forEach((profile) => {
    if (profile.scope === "product") {
      productMap.set(
        profile.product?.toString(),
        profile.priceMultiplier
      );
    }
    if (profile.scope === "city") {
      cityMultiplier = profile.priceMultiplier;
    }
  });

  return products.map((product) => {
    let multiplier =
      productMap.get(product._id.toString()) ||
      cityMultiplier;

    if (!multiplier || multiplier === 1) return product;

    return {
      ...product,
      pricing: {
        ...product.pricing,
        minPrice: Math.round(product.pricing.minPrice * multiplier),
        maxPrice: Math.round(product.pricing.maxPrice * multiplier),
        discountedPrice: product.pricing.discountedPrice
          ? Math.round(product.pricing.discountedPrice * multiplier)
          : undefined,
        securityDeposit: product.pricing.securityDeposit
          ? Math.round(product.pricing.securityDeposit * multiplier)
          : 0,
        serviceCharge: product.pricing.serviceCharge
          ? Math.round(product.pricing.serviceCharge * multiplier)
          : 0,
      },
    };
  });
}


/* =======================
   CREATE PRODUCT (ADMIN)
======================= */
export async function POST(req) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await req.json();

    if (!body.title || !body.description) {
      return NextResponse.json(
        { success: false, message: "Title and description required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.images) || !body.images.length) {
      return NextResponse.json(
        { success: false, message: "At least one image required" },
        { status: 400 }
      );
    }

    if (!body.categories?.length) {
      return NextResponse.json(
        { success: false, message: "At least one category required" },
        { status: 400 }
      );
    }

    if (!body.pricing?.unit || body.pricing.minPrice == null || body.pricing.maxPrice == null) {
      return NextResponse.json(
        { success: false, message: "Pricing information incomplete" },
        { status: 400 }
      );
    }

    let slug = body.slug
      ? createSlug(body.slug)
      : createSlug(body.title);

    const exists = await Product.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    const product = await Product.create({
      title: body.title,
      slug,
      description: body.description,
      images: body.images,
      categories: body.categories,
      tags: body.tags || [],
      pricing: body.pricing,
      serviceAreas: body.serviceAreas || [],
      faqs: body.faqs || [],
      termsAndConditions: body.termsAndConditions,
      seo: body.seo || {},
      status: body.status || "draft",

      highlights: {
        isTopRented: body.highlights?.isTopRented || false,
        isBestDeal: body.highlights?.isBestDeal || false,
        isNewProduct: body.highlights?.isNewProduct || false,
        isFeatured: body.highlights?.isFeatured || false,
      },
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/products error:", err);

    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Duplicate slug" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
