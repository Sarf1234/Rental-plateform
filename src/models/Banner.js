import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    desktopImage: {
      type: String,
      required: true,
    },

    mobileImage: {
      type: String,
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      default: null,
      index: true,
    },

    placement: {
      type: String,
      enum: [
        "homepage",
        "citypage",
        "products",
        "services",
        "vendors",
        "service-category",
        "product-category",
      ],
      default: "homepage",
      index: true,
    },

    buttonText: {
      type: String,
      trim: true,
    },

    buttonLink: {
      type: String,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

BannerSchema.index({
  city: 1,
  placement: 1,
  isActive: 1,
});

const Banner =
  mongoose.models.Banner ||
  mongoose.model("Banner", BannerSchema);

export default Banner;