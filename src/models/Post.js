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

/* ---------------- SEO SUB-SCHEMA ---------------- */
const SEOSchema = new mongoose.Schema(
  {
    canonicalUrl: { type: String, trim: true },
    noIndex: { type: Boolean, default: false },

    ogTitle: { type: String, maxlength: 70 },
    ogDescription: { type: String, maxlength: 160 },
    ogImage: { type: String },
  },
  { _id: false }
);

/* ---------------- POST SCHEMA ---------------- */
const PostSchema = new mongoose.Schema(
  {
    /* ---------- CORE ---------- */
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },

    excerpt: { type: String },
    coverImage: { type: String },

    /* ---------- RELATIONS ---------- */
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    /* ---------- NEW: RELATED SERVICES ---------- */
    relatedServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],

    /* ---------- NEW: RELATED PRODUCTS ---------- */
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    /* ---------- NEW: FAQ ---------- */
    faqs: [FAQSchema],

    /* ---------- INTERNAL LINKING ---------- */
    internalLinks: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    /* ---------- FLAGS ---------- */
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    publishedAt: { type: Date },

    readTime: { type: Number },

    /* ---------- BASIC META ---------- */
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],

    /* ---------- NEW: ADVANCED SEO ---------- */
    seo: SEOSchema,
  },
  { timestamps: true }
);

/* ---------- TEXT INDEX ---------- */
PostSchema.index({ title: "text", content: "text", excerpt: "text" });

/* ---------- SAFE EXPORT ---------- */
export default mongoose.models.Post ||
  mongoose.model("Post", PostSchema);