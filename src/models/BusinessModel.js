import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema(
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
    serviceAreas: [
      { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);


const Business =
  mongoose.models.Business ||
  mongoose.model("Business", BusinessSchema);

export default Business;
