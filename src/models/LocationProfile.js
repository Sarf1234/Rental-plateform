import mongoose from "mongoose";

const { Schema } = mongoose;

const LocationProfileSchema = new Schema(
  {
    /* ================================
       REQUIRED CITY
    ================================= */
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
      index: true,
    },

    /* ================================
       SCOPE SELECTOR
       Defines what this profile targets
    ================================= */
    scope: {
      type: String,
      enum: [
        "city",
        "product",
        "service",
        "productCategory",
        "serviceCategory",
      ],
      required: true,
      index: true,
    },

    /* ================================
       TARGET REFERENCES
       Only one allowed depending on scope
    ================================= */
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },

    productCategory: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
    },

    serviceCategory: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
    },

    /* ================================
       CONTEXT INTELLIGENCE
    ================================= */
    priceMultiplier: {
      type: Number,
      default: 1,
      min: 0,
    },

    demandLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    customIntro: {
      type: String,
      trim: true,
    },

    seasonalNote: {
      type: String,
      trim: true,
    },

    deliveryNote: {
      type: String,
      trim: true,
    },

    trendingText: {
      type: String,
      trim: true,
    },

    expressAvailable: {
      type: Boolean,
      default: false,
    },

    /* ================================
       OPTIONAL SEO OVERRIDES
    ================================= */
    seoTitleOverride: {
      type: String,
      trim: true,
      maxlength: 70,
    },

    seoDescriptionOverride: {
      type: String,
      trim: true,
      maxlength: 160,
    },

    additionalContent: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

/* =====================================================
   VALIDATION — ENFORCE CORRECT TARGET PER SCOPE
===================================================== */
LocationProfileSchema.pre("validate", function (next) {
  switch (this.scope) {
    case "city":
      if (
        this.product ||
        this.service ||
        this.productCategory ||
        this.serviceCategory
      ) {
        return next(
          new Error("City scope must not contain product/service/category references.")
        );
      }
      break;

    case "product":
      if (!this.product) {
        return next(new Error("Product is required for product scope."));
      }
      break;

    case "service":
      if (!this.service) {
        return next(new Error("Service is required for service scope."));
      }
      break;

    case "productCategory":
      if (!this.productCategory) {
        return next(new Error("ProductCategory is required for productCategory scope."));
      }
      break;

    case "serviceCategory":
      if (!this.serviceCategory) {
        return next(new Error("ServiceCategory is required for serviceCategory scope."));
      }
      break;

    default:
      return next(new Error("Invalid scope value."));
  }

});

/* =====================================================
   UNIQUE INDEXES — STRICT DUPLICATE PROTECTION
===================================================== */

/* City-level profile (only one per city) */
LocationProfileSchema.index(
  { city: 1 },
  {
    unique: true,
    partialFilterExpression: { scope: "city" },
  }
);

/* City + Product */
LocationProfileSchema.index(
  { city: 1, product: 1 },
  {
    unique: true,
    partialFilterExpression: {
      scope: "product",
      product: { $exists: true },
    },
  }
);

/* City + Service */
LocationProfileSchema.index(
  { city: 1, service: 1 },
  {
    unique: true,
    partialFilterExpression: {
      scope: "service",
      service: { $exists: true },
    },
  }
);

/* City + Product Category */
LocationProfileSchema.index(
  { city: 1, productCategory: 1 },
  {
    unique: true,
    partialFilterExpression: {
      scope: "productCategory",
      productCategory: { $exists: true },
    },
  }
);

/* City + Service Category */
LocationProfileSchema.index(
  { city: 1, serviceCategory: 1 },
  {
    unique: true,
    partialFilterExpression: {
      scope: "serviceCategory",
      serviceCategory: { $exists: true },
    },
  }
);

export default mongoose.models.LocationProfile ||
  mongoose.model("LocationProfile", LocationProfileSchema);