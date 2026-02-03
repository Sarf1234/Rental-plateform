import mongoose from "mongoose";

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

/* ---------------- SERVICE SCHEMA ---------------- */
const ServiceSchema = new mongoose.Schema(
  {
    /* ---------- CORE ---------- */
    title: {
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

    description: {
      type: String,
      required: true,
    },

    serviceType: {
      type: String,
      enum: ["on_site", "remote", "hybrid"],
      required: true,
      index: true,
    },

    /* ---------- MEDIA ---------- */
    images: {
      type: [String],
      default: [],
    },

    /* ---------- LOCATION ---------- */
    serviceAreas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        index: true,
      },
    ],

    /* ---------- PROVIDERS (MULTI BUSINESS SUPPORT) ---------- */
    providers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        index: true,
      },
    ],

    /* ---------- PRODUCTS (MULTIPLE PRODUCTS UNDER SERVICE) ---------- */
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        index: true,
      },
    ],

    /* ---------- PRICING (DISPLAY PURPOSE) ---------- */
    pricing: {
      type: {
        type: String,
        enum: ["fixed", "starting_from", "quote"],
        default: "quote",
      },
      amount: {
        type: Number,
        min: 0,
      },
      label: {
        type: String, // e.g. "Starting from ₹999"
        trim: true,
      },
    },

    /* ---------- CONTACT / CTA ---------- */
    contactMode: {
      type: String,
      enum: ["call", "whatsapp", "call_whatsapp"],
      default: "call_whatsapp",
      index: true,
    },

    whatsappNumber: {
      type: String,
      trim: true,
    },

    callNumber: {
      type: String,
      trim: true,
    },

    /* ---------- VALUE PROPOSITION ---------- */
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    serviceProcess: [
      {
        step: { type: Number },
        title: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],

    /* ---------- FAQ ---------- */
    faqs: [FAQSchema],

    /* ---------- SEO METADATA ---------- */
    seo: {
      metaTitle: {
        type: String,
        maxlength: 70,
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

    /* ---------- PROMOTION FLAGS ---------- */
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isTopService: {
      type: Boolean,
      default: false,
      index: true,
    },

    isBestService: {
      type: Boolean,
      default: false,
      index: true,
    },

    priority: {
      type: Number,
      default: 0,
      index: true,
    },

    /* ---------- STATUS ---------- */
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
  },
  { timestamps: true }
);

/* ---------- SAFE MODEL EXPORT ---------- */
const Service =
  mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service;
