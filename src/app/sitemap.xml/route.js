// app/sitemap/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import Tag from "@/models/Tag";
import City from "@/models/CityModels";
import Service from "@/models/Serviceproduct";
import Product from "@/models/Product"; // ✅ Added Product Model

export async function GET() {
  try {
    await connectDB();

    const [
      posts,
      categories,
      tags,
      cities,
      services,
      products, // ✅ Fetch products
    ] = await Promise.all([
      Post.find({}, "slug updatedAt").lean(),
      Category.find({}, "slug").lean(),
      Tag.find({}, "slug").lean(),
      City.find({ isActive: true }, "slug updatedAt").lean(),
      Service.find(
        { status: "published" },
        "slug serviceAreas updatedAt seo"
      ).lean(),
      Product.find(
        { status: "published" },
        "slug serviceAreas updatedAt seo"
      ).lean(),
    ]);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://yourdomain.com";

    const urls = [];
    const addedUrls = new Set(); // ✅ Prevent duplicates

    const pushUrl = (urlObj) => {
      if (!addedUrls.has(urlObj.loc)) {
        addedUrls.add(urlObj.loc);
        urls.push(urlObj);
      }
    };

    // =========================
    // STATIC PAGES
    // =========================
    pushUrl({ loc: `${baseUrl}/` });
    pushUrl({ loc: `${baseUrl}/blog` });

    // =========================
    // BLOG
    // =========================
    posts.forEach((p) => {
      pushUrl({
        loc: `${baseUrl}/blog/${p.slug}`,
        lastmod: p.updatedAt
          ? new Date(p.updatedAt).toISOString()
          : null,
      });
    });

    categories.forEach((c) => {
      pushUrl({
        loc: `${baseUrl}/category/${c.slug}`,
      });
    });

    tags.forEach((t) => {
      pushUrl({
        loc: `${baseUrl}/tag/${t.slug}`,
      });
    });

    // =========================
    // CITY PAGES
    // =========================
    cities.forEach((city) => {
      pushUrl({
        loc: `${baseUrl}/city/${city.slug}`,
        lastmod: city.updatedAt
          ? new Date(city.updatedAt).toISOString()
          : null,
      });

      // ✅ City Products Listing Page
      pushUrl({
        loc: `${baseUrl}/city/${city.slug}/products`,
      });
    });

    // =========================
    // SERVICE PAGES (CITY-WISE)
    // =========================
    services.forEach((service) => {
      if (service.seo?.noIndex) return;

      service.serviceAreas?.forEach((cityId) => {
        const city = cities.find(
          (c) => c._id.toString() === cityId.toString()
        );

        if (city) {
          pushUrl({
            loc: `${baseUrl}/city/${city.slug}/${service.slug}`,
            lastmod: service.updatedAt
              ? new Date(service.updatedAt).toISOString()
              : null,
          });
        }
      });
    });

    // =========================
    // PRODUCT PAGES (CITY-WISE)
    // =========================
    products.forEach((product) => {
      if (product.seo?.noIndex) return;

      product.serviceAreas?.forEach((cityId) => {
        const city = cities.find(
          (c) => c._id.toString() === cityId.toString()
        );

        if (city) {
          pushUrl({
            loc: `${baseUrl}/city/${city.slug}/products/${product.slug}`,
            lastmod: product.updatedAt
              ? new Date(product.updatedAt).toISOString()
              : null,
          });
        }
      });
    });

    // =========================
    // GENERATE XML
    // =========================
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
  </url>`
  )
  .join("")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (err) {
    console.error("Failed to generate sitemap", err);
    return NextResponse.json(
      { error: "Failed to generate sitemap" },
      { status: 500 }
    );
  }
}
