import mongoose from "mongoose";
import { nanoid } from "nanoid";
import Product from "../models/Product.js";

const MONGO_URI = "mongodb+srv://sarfrajshekh883_db_user:7vRas3cfaXoeFOPe@cluster0.adyooir.mongodb.net/rentalservices"; // 👈 yaha apna DB URL daalo

async function runMigration() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    // Find products without productCode
    const products = await Product.find({
      $or: [
        { productCode: { $exists: false } },
        { productCode: null },
        { productCode: "" },
      ],
    });

    console.log(`🔎 Found ${products.length} products to update`);

    for (const product of products) {
      let code;
      let exists = true;

      // Collision safe generation
      while (exists) {
        code = "PRD-" + nanoid(6).toUpperCase();
        exists = await Product.findOne({ productCode: code });
      }

      product.productCode = code;
      await product.save();

      console.log(`✔ Updated: ${product.title} → ${code}`);
    }

    console.log("🎉 Migration Completed Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Migration Failed:", error);
    process.exit(1);
  }
}

runMigration();
