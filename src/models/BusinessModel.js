import mongoose from "mongoose";

/* ---------------- PRODUCT SUB-SCHEMA ---------------- */
const VendorProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    price: {
      type: Number,
      min: 0,
    },

    discountedPrice: {
      type: Number,
      min: 0,
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

/* ---------------- SERVICE SUB-SCHEMA ---------------- */
const VendorServiceSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    price: {
      type: Number,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

/* ---------------- BUSINESS SCHEMA ---------------- */
const BusinessSchema = new mongoose.Schema(
  {
    /* ---------- EXISTING FIELDS ---------- */

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },

    // Business operates in which cities
    serviceAreas: [{ type: mongoose.Schema.Types.ObjectId, ref: "City" }],

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },

    /* ---------- CONTACT ---------- */

    whatsappNumber: {
      type: String,
      trim: true,
    },

    contactPreference: {
      type: String,
      enum: ["call", "whatsapp", "both"],
      default: "both",
    },

    website: {
      type: String,
      trim: true,
    },

    /* ---------- BUSINESS STATS ---------- */

    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ---------- BUSINESS PROFILE ---------- */

    intro: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
    },

    experienceYears: {
      type: Number,
      min: 0,
    },

    /* ---------- MEDIA ---------- */

    logo: {
      type: String,
    },

    coverImage: {
      type: String,
    },

    gallery: [String],

    /* ---------- PRODUCTS OFFERED ---------- */

    products: [VendorProductSchema],

    /* ---------- SERVICES OFFERED ---------- */

    services: [VendorServiceSchema],

    /* ---------- VENDOR RATING ---------- */

    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ---------- PLATFORM FLAGS ---------- */

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    priority: {
      type: Number,
      default: 0,
      index: true,
    },

    /* ---------- SEO ---------- */

    seo: {
      metaTitle: {
        type: String,
        maxlength: 70,
      },

      metaDescription: {
        type: String,
        maxlength: 160,
      },

      canonicalUrl: {
        type: String,
      },

      noIndex: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

/* ---------------- VALIDATIONS ---------------- */

VendorProductSchema.pre("validate", function (next) {
  if (
    this.discountedPrice &&
    this.price &&
    this.discountedPrice > this.price
  ) {
    return next(new Error("discountedPrice cannot exceed price"));
  }


});

/* ---------------- PERFORMANCE INDEXES ---------------- */

BusinessSchema.index({ "products.product": 1 });
BusinessSchema.index({ "services.service": 1 });
BusinessSchema.index({ serviceAreas: 1 });
BusinessSchema.index({ ratingAvg: -1 });
BusinessSchema.index({ slug: 1, status: 1 });

/* ---------------- SAFE MODEL EXPORT ---------------- */

const Business =
  mongoose.models.Business || mongoose.model("Business", BusinessSchema);

export default Business;