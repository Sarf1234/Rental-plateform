import mongoose from "mongoose";
import { nanoid } from "nanoid";

/* ---------------- FAQ SUB-SCHEMA ---------------- */
const FAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

/* ---------------- PRODUCT SCHEMA ---------------- */
const ProductSchema = new mongoose.Schema(
  {
    /* ---------- CORE ---------- */
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },

    productCode: {
      type: String,
      unique: true,
      index: true,
    },
    description: { type: String, required: true },

    images: {
      type: [String],
      validate: [(v) => v.length > 0, "At least one image required"],
    },

  categories: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
    required: true,
    index: true,
  },
],

tags: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductTag",
    index: true,
  },
],


    /* ---------- PRICING ---------- */
    pricing: {
      unit: {
        type: String,
        enum: ["hour", "day", "event"],
        required: true,
      },
      minPrice: { type: Number, required: true, min: 0 },
      maxPrice: { type: Number, required: true, min: 0 },
      discountedPrice: { type: Number, min: 0 },
      securityDeposit: { type: Number, default: 0 },
      serviceCharge: { type: Number, default: 0 },
    },

    /* ---------- LOCATION ---------- */
    serviceAreas: [
      { type: mongoose.Schema.Types.ObjectId, ref: "City", index: true },
    ],

    /* ---------- FAQ ---------- */
    faqs: [FAQSchema],

    /* ---------- LEGAL ---------- */
    termsAndConditions: { type: String },

    /* ---------- SEO METADATA ---------- */
    seo: {
      metaTitle: {
        type: String,
        maxlength: 70, // Google title limit
      },

      metaDescription: {
        type: String,
        maxlength: 160,
      },

      metaKeywords: [
        {
          type: String,
          trim: true,
        },
      ],

      canonicalUrl: {
        type: String,
      },

      noIndex: {
        type: Boolean,
        default: false,
      },

      // Optional but future-proof
      ogTitle: {
        type: String,
        maxlength: 70,
      },

      ogDescription: {
        type: String,
        maxlength: 160,
      },

      ogImage: {
        type: String,
      },
    },

    

    /* ---------- STATUS ---------- */
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    highlights: {
        isTopRented: { type: Boolean, default: false, index: true },
        isBestDeal: { type: Boolean, default: false, index: true },
        isNewProduct: { type: Boolean, default: false, index: true },
        isFeatured: { type: Boolean, default: false, index: true },
      },
  },
  { timestamps: true }
);

/* ---------- TEXT SEARCH INDEX ---------- */
ProductSchema.index(
  {
    title: "text",
    description: "text",
    productCode: "text",
  },
  {
    weights: {
      title: 5,
      productCode: 4,
      description: 1,
    },
  }
);

/* ---------- PERFORMANCE INDEXES ---------- */
ProductSchema.index({ serviceAreas: 1 });
ProductSchema.index({ serviceAreas: 1, status: 1 });
ProductSchema.index({ categories: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ "pricing.minPrice": 1 });
ProductSchema.index({ "highlights.isFeatured": 1 });
ProductSchema.index({ "highlights.isTopRented": 1 });
ProductSchema.index({ "highlights.isBestDeal": 1 });
ProductSchema.index({ "highlights.isNewProduct": 1 });


/* ---------- PRICE SANITY CHECK ---------- */
ProductSchema.pre("validate", function () {
  if (this.pricing.minPrice > this.pricing.maxPrice) {
    throw new Error("minPrice cannot be greater than maxPrice");
  }

  if (
    this.pricing.discountedPrice &&
    this.pricing.discountedPrice > this.pricing.maxPrice
  ) {
    throw new Error("discountedPrice cannot exceed maxPrice");
  }
});

ProductSchema.pre("save", async function (next) {
  if (!this.productCode) {
    let code;
    let exists = true;

    while (exists) {
      code = "PRD-" + nanoid(6).toUpperCase();
      exists = await mongoose.models.Product.findOne({ productCode: code });
    }

    this.productCode = code;
  }

 
});



const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
