import mongoose from "mongoose";

const ProductCategorySchema = new mongoose.Schema(
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

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      default: null,
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
const ProductCategory =
  mongoose.models.ProductCategory ||
  mongoose.model("ProductCategory", ProductCategorySchema);

export default ProductCategory;
