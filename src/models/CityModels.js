import mongoose from "mongoose";

const CitySchema = new mongoose.Schema(
  {
    /* ---------- CORE ---------- */
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

    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    subAreas: [
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
],

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

      // Social / sharing ready
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

    /* ---------- GEO (FUTURE USE) ---------- */
    geo: {
      lat: { type: Number },
      lng: { type: Number },
    },

    /* ---------- STATUS ---------- */
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const City =
  mongoose.models.City || mongoose.model("City", CitySchema);

export default City;
