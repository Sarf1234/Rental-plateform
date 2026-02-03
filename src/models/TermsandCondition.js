import mongoose from "mongoose";

const TermsSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Rental Terms & Conditions" },

    content: {
      type: String,
      required: true,
    },

    applicableTo: {
      type: String,
      enum: ["product", "service", "all"],
      default: "all",
    },

    version: {
      type: String,
      required: true, // e.g. 1.0, 1.1
    },

    effectiveFrom: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TermsAndConditions", TermsSchema);
