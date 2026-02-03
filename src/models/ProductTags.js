import mongoose from "mongoose";

const ProductTagSchema = new mongoose.Schema(
  {
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

    seo: {
      metaTitle: { type: String, maxlength: 70 },
      metaDescription: { type: String, maxlength: 160 },
      metaKeywords: [{ type: String, trim: true }],
      canonicalUrl: { type: String },
      noIndex: { type: Boolean, default: false },
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ Next.js safe export
const ProductTag =
  mongoose.models.ProductTag ||
  mongoose.model("ProductTag", ProductTagSchema);

export default ProductTag;
