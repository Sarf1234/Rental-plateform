import mongoose from "mongoose";

const ServiceCategorySchema = new mongoose.Schema(
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

    description: {
      type: String,
      trim: true,
    },

    images: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length <= 4;
        },
        message: "You can upload maximum 4 images per category",
      },
      default: [],
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
const ServiceCategory =
  mongoose.models.ServiceCategory ||
  mongoose.model("ServiceCategory", ServiceCategorySchema);

export default ServiceCategory;
