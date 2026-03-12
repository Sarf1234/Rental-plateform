import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductCategory from "@/models/ProductCategory";
import ProductTag from "@/models/ProductTags";
import City from "@/models/CityModels";
import Service from "@/models/Serviceproduct";
import Business from "@/models/BusinessModel";
import { requireAdmin } from "@/lib/protectRoute";
import { createSlug } from "@/utils/createSlug";
import LocationProfile from "@/models/LocationProfile";

/* =======================
   GET PRODUCT BY SLUG
======================= */


export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const { searchParams } = new URL(req.url);
    const citySlug = searchParams.get("city");
    const isAdminPreview = searchParams.get("admin") === "true";

    /* ================= PRODUCT ================= */

    const product = await Product.findOne({ slug })
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate("serviceAreas", "name slug")
      .populate({
        path: "suggestedProducts",
        select: "title slug images pricing serviceAreas productCode",
        options: { limit: 6 },
      })

      .populate({
        path: "suggestedServices",
        select: "title slug images pricing serviceAreas",
        options: { limit: 6 },
      })
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    /* ================= CITY ================= */

    let city = null;
    let locationProfile = null;

    if (citySlug) {
      city = await City.findOne({
        slug: citySlug,
        isActive: true,
      })
        .select("name slug subAreas")
        .lean();

      if (!city) {
        return NextResponse.json(
          { success: false, message: "City not found" },
          { status: 404 }
        );
      }

      const isAvailableInCity = product.serviceAreas?.some(
        (area) => area.slug === citySlug
      );

      if (!isAvailableInCity && !isAdminPreview) {
        return NextResponse.json(
          { success: false, message: "Product not available in this city" },
          { status: 404 }
        );
      }

      /* ================= LOCATION PROFILE ================= */

      locationProfile = await LocationProfile.findOne({
        city: city._id,
        scope: "product",
        product: product._id,
      }).lean();

      /* ================= APPLY MULTIPLIER ================= */

      if (
        locationProfile?.priceMultiplier &&
        locationProfile.priceMultiplier !== 1
      ) {
        const multiplier = locationProfile.priceMultiplier;

        product.pricing.minPrice = Math.round(
          product.pricing.minPrice * multiplier
        );

        product.pricing.maxPrice = Math.round(
          product.pricing.maxPrice * multiplier
        );

        if (product.pricing.discountedPrice) {
          product.pricing.discountedPrice = Math.round(
            product.pricing.discountedPrice * multiplier
          );
        }

        product.pricing.securityDeposit = Math.round(
          product.pricing.securityDeposit * multiplier
        );

        product.pricing.serviceCharge = Math.round(
          product.pricing.serviceCharge * multiplier
        );
      }
    }

    /* ================= RELATED SERVICES ================= */

    let relatedServices = [];
    let relatedProducts = [];
    let providers = [];

    if (city) {
      relatedServices = await Service.find({
        products: product._id,
        serviceAreas: city._id,
        status: "published",
      })
        .populate("providers", "name slug phone serviceAreas isVerified")
        .limit(6)
        .lean();

      /* ================= PROVIDERS (DEDUPED) ================= */

      const providerSet = new Set();

      relatedServices.forEach((service) => {
        service.providers?.forEach((provider) => {
          providerSet.add(provider._id.toString());
        });
      });

      if (providerSet.size > 0) {
        providers = await Business.find({
          _id: { $in: [...providerSet] },
          serviceAreas: city._id,
          status: "active",
        })
          .select("name slug phone isVerified")
          .lean();
      }

      /* ================= RELATED PRODUCTS ================= */

      relatedProducts = await Product.find({
        _id: { $ne: product._id },
        serviceAreas: city._id,
        status: "published",
        $or: [
          { categories: { $in: product.categories } },
          { tags: { $in: product.tags } },
        ],
      })
        .limit(6)
        .lean();
    }


    if (city) {
  if (product.suggestedProducts?.length) {
    product.suggestedProducts = product.suggestedProducts.filter((p) =>
      p.serviceAreas?.some((area) => area.toString() === city._id.toString())
    );
  }

  if (product.suggestedServices?.length) {
    product.suggestedServices = product.suggestedServices.filter((s) =>
      s.serviceAreas?.some((area) => area.toString() === city._id.toString())
    );
  }
}

    /* ================= VENDORS FOR PRODUCT ================= */

    let vendors = [];
    let totalReviews = 0;
    let weightedSum = 0;

    if (city) {
      const businesses = await Business.find({
        status: "active",
        serviceAreas: city._id,
        "products.product": product._id,
      })
        .select(
          `
          name slug logo phone whatsappNumber contactPreference website
          ratingAvg ratingCount totalOrders experienceYears
          isVerified isFeatured address products
        `
        )
        .lean();

      vendors = businesses
        .map((b) => {
          const vendorProduct = b.products.find(
            (p) => p.product.toString() === product._id.toString()
          );

          if (!vendorProduct) return null;

          const ratingAvg = vendorProduct.ratingAvg || 0;
          const ratingCount = vendorProduct.ratingCount || 0;

          totalReviews += ratingCount;
          weightedSum += ratingAvg * ratingCount;

          return {
            _id: b._id,

            /* BASIC */
            name: b.name,
            slug: b.slug,
            logo: b.logo,

            /* LOCATION */
            location: {
              street: b.address?.street,
              city: b.address?.city,
              state: b.address?.state,
              pincode: b.address?.pincode,
            },

            /* CONTACT */
            contact: {
              phone: b.phone,
              whatsapp: b.whatsappNumber,
              preference: b.contactPreference,
              website: b.website,
            },

            /* TRUST BADGES */
            badges: {
              verified: b.isVerified,
              featured: b.isFeatured,
            },

            /* VENDOR STATS */
            stats: {
              ratingAvg: b.ratingAvg,
              ratingCount: b.ratingCount,
              totalOrders: b.totalOrders,
              experienceYears: b.experienceYears,
            },

            /* PRODUCT SPECIFIC DATA */
            product: {
              price: vendorProduct.price,
              discountedPrice: vendorProduct.discountedPrice,
              securityDeposit: vendorProduct.securityDeposit,
              isAvailable: vendorProduct.isAvailable,
              ratingAvg: vendorProduct.ratingAvg,
              ratingCount: vendorProduct.ratingCount,
            },
          };
        })
        .filter(Boolean);

      /* SORT BY CHEAPEST PRICE */

      vendors.sort(
        (a, b) => (a.product.price || 0) - (b.product.price || 0)
      );
    }

    /* ================= PRODUCT RATING ================= */

    let productRating = 0;
    let productReviewCount = totalReviews;

    if (totalReviews > 0) {
      productRating = Number((weightedSum / totalReviews).toFixed(1));
    }

    /* ================= LOCATION CONTEXT DATA ================= */

    const locationContext = locationProfile
      ? {
          demandLevel: locationProfile.demandLevel,
          customIntro: locationProfile.customIntro,
          seasonalNote: locationProfile.seasonalNote,
          deliveryNote: locationProfile.deliveryNote,
          trendingText: locationProfile.trendingText,
          expressAvailable: locationProfile.expressAvailable,
          additionalContent: locationProfile.additionalContent,
          seoTitleOverride: locationProfile.seoTitleOverride,
          seoDescriptionOverride:
            locationProfile.seoDescriptionOverride,
        }
      : null;

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      success: true,

      data: product,

      /* PRODUCT RATING */
      productRating,
      productReviewCount,

      /* VENDORS */
      vendors,

      locationContext,
      relatedServices,
      relatedProducts,
      providers,
      city: city || null,
    });

  } catch (err) {
    console.error("GET /api/products/[slug] error:", err);

    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}


/* =======================
   UPDATE PRODUCT (ADMIN)
======================= */
export async function PUT(req, { params }) {
  try {
    await requireAdmin();
    await connectDB();

    const { slug } = await params;
    const body = await req.json();

    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    /* ---------- SLUG UPDATE (SAFE) ---------- */
    if (body.slug) {
      const newSlug = createSlug(body.slug);
      const exists = await Product.findOne({
        slug: newSlug,
        _id: { $ne: product._id },
      });
      if (exists) {
        return NextResponse.json(
          { success: false, message: "Slug already in use" },
          { status: 409 }
        );
      }
      product.slug = newSlug;
    }

    /* ---------- BASIC FIELDS ---------- */
    if (body.title) product.title = body.title;
    if (body.description) product.description = body.description;
    if (body.images) product.images = body.images;
    if (body.categories) product.categories = body.categories;
    if (body.tags) product.tags = body.tags;
    if (body.suggestedProducts !== undefined)
      product.suggestedProducts = body.suggestedProducts;

    if (body.suggestedServices !== undefined)
      product.suggestedServices = body.suggestedServices;
    if (body.pricing) product.pricing = body.pricing;
    if (body.serviceAreas) product.serviceAreas = body.serviceAreas;
    if (body.faqs) product.faqs = body.faqs;
    if (body.termsAndConditions)
      product.termsAndConditions = body.termsAndConditions;
    if (body.seo) product.seo = body.seo;
    if (body.status) product.status = body.status;

    /* ---------- HIGHLIGHTS ---------- */
    if (body.highlights) {
      product.highlights = {
        ...product.highlights,
        ...body.highlights,
      };
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    console.error("PUT /api/products/[slug] error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

/* =======================
   DELETE PRODUCT (SOFT)
======================= */
export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    await connectDB();

    const { slug } = await params;

    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    product.status = "archived";
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product archived successfully",
    });
  } catch (err) {
    console.error("DELETE /api/products/[slug] error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
