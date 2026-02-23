// app/sitemap/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import Tag from "@/models/Tag";
import City from "@/models/CityModels";
import Service from "@/models/Serviceproduct";
import Product from "@/models/Product";
import ServiceCategory from "@/models/ServiceCategory"; // ✅ NEW
import ProductCategory from "@/models/ProductCategory"; // ✅ NEW

export async function GET() {
  try {
    await connectDB();

    const [
      posts,
      blogCategories,
      tags,
      cities,
      services,
      products,
      serviceCategories,
      productCategories,
    ] = await Promise.all([
      Post.find({}, "slug updatedAt").lean(),
      Category.find({}, "slug").lean(),
      Tag.find({}, "slug").lean(),
      City.find({ isActive: true }, "slug updatedAt").lean(),
      Service.find(
        { status: "published" },
        "slug serviceAreas updatedAt seo",
      ).lean(),
      Product.find(
        { status: "published" },
        "slug serviceAreas updatedAt seo",
      ).lean(),
      ServiceCategory.find({ isActive: true }, "slug").lean(), // ✅
      ProductCategory.find({ isActive: true }, "slug").lean(), // ✅
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kiraynow.com";

    const urls = [];
    const addedUrls = new Set();

    const pushUrl = ({
      loc,
      lastmod = null,
      priority = "0.5",
      changefreq = "monthly",
    }) => {
      if (!addedUrls.has(loc)) {
        addedUrls.add(loc);
        urls.push({ loc, lastmod, priority, changefreq });
      }
    };

    // =========================
    // STATIC PAGES
    // =========================
    pushUrl({
      loc: `${baseUrl}/`,
      priority: "1.0",
      changefreq: "daily",
    });

    pushUrl({
      loc: `${baseUrl}/blog`,
      priority: "0.7",
      changefreq: "weekly",
    });

    // Informational Pages
    pushUrl({
      loc: `${baseUrl}/about`,
      priority: "0.6",
      changefreq: "yearly",
    });

    pushUrl({
      loc: `${baseUrl}/terms-and-conditions`,
      priority: "0.3",
      changefreq: "yearly",
    });

    pushUrl({
      loc: `${baseUrl}/privacy-policy`,
      priority: "0.3",
      changefreq: "yearly",
    });

    pushUrl({
      loc: `${baseUrl}/return-policy`,
      priority: "0.3",
      changefreq: "yearly",
    });

    pushUrl({
      loc: `${baseUrl}/faq`,
      priority: "0.4",
      changefreq: "monthly",
    });

    // =========================
    // BLOG
    // =========================
    posts.forEach((p) => {
      pushUrl({
        loc: `${baseUrl}/blog/${p.slug}`,
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
        priority: "0.6",
        changefreq: "monthly",
      });
    });

   // =========================
// BLOG CATEGORIES (COMMENTED OUT – CONDITIONAL INDEX)
// =========================
// blogCategories.forEach((c) => {
//   pushUrl({
//     loc: `${baseUrl}/category/${c.slug}`,
//     priority: "0.5",
//     changefreq: "monthly",
//   });
// });

   // =========================
// BLOG TAGS (COMMENTED OUT – NOINDEXED)
// =========================
// tags.forEach((t) => {
//   pushUrl({
//     loc: `${baseUrl}/tag/${t.slug}`,
//     priority: "0.5",
//     changefreq: "monthly",
//   });
// });

    // =========================
    // CITY PAGES
    // =========================
    cities.forEach((city) => {
      pushUrl({
        loc: `${baseUrl}/${city.slug}`,
        lastmod: city.updatedAt ? new Date(city.updatedAt).toISOString() : null,
        priority: "0.9",
        changefreq: "weekly",
      });

      pushUrl({
        loc: `${baseUrl}/${city.slug}/products`,
        priority: "0.7",
        changefreq: "weekly",
      });
    });

    // =========================
    // SERVICE PAGES
    // =========================
    services.forEach((service) => {
      if (service.seo?.noIndex) return;

      service.serviceAreas?.forEach((cityId) => {
        const city = cities.find((c) => c._id.toString() === cityId.toString());

        if (city) {
          pushUrl({
            loc: `${baseUrl}/${city.slug}/${service.slug}`,
            lastmod: service.updatedAt
              ? new Date(service.updatedAt).toISOString()
              : null,
            priority: "0.8",
            changefreq: "weekly",
          });
        }
      });
    });

    // =========================
    // PRODUCT PAGES
    // =========================
    products.forEach((product) => {
      if (product.seo?.noIndex) return;

      product.serviceAreas?.forEach((cityId) => {
        const city = cities.find((c) => c._id.toString() === cityId.toString());

        if (city) {
          pushUrl({
            loc: `${baseUrl}/${city.slug}/products/${product.slug}`,
            lastmod: product.updatedAt
              ? new Date(product.updatedAt).toISOString()
              : null,
            priority: "0.8",
            changefreq: "weekly",
          });
        }
      });
    });

    // =========================
    // SERVICE CATEGORY PAGES (CITY-WISE) ✅ NEW
    // =========================
    // cities.forEach((city) => {
    //   serviceCategories.forEach((cat) => {
    //     pushUrl({
    //       loc: `${baseUrl}/${city.slug}/service-categories/${cat.slug}`,
    //       priority: "0.7",
    //       changefreq: "weekly",
    //     });
    //   });
    // });

    // =========================
    // PRODUCT CATEGORY PAGES (CITY-WISE) ✅ NEW
    // =========================
    // cities.forEach((city) => {
    //   productCategories.forEach((cat) => {
    //     pushUrl({
    //       loc: `${baseUrl}/${city.slug}/categories/${cat.slug}`,
    //       priority: "0.7",
    //       changefreq: "weekly",
    //     });
    //   });
    // });

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
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Failed to generate sitemap", err);
    return NextResponse.json(
      { error: "Failed to generate sitemap" },
      { status: 500 },
    );
  }
}
