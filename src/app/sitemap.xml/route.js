// app/sitemap/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import Tag from "@/models/Tag";
import City from "@/models/CityModels";
import Service from "@/models/Serviceproduct";

export async function GET() {
  try {
    await connectDB();

    const [
      posts,
      categories,
      tags,
      cities,
      services,
    ] = await Promise.all([
      Post.find({}, "slug updatedAt").lean(),
      Category.find({}, "slug").lean(),
      Tag.find({}, "slug").lean(),
      City.find({ isActive: true }, "slug updatedAt").lean(),
      Service.find(
        { status: "published" },
        "slug serviceAreas updatedAt seo"
      ).lean(),
    ]);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://yourdomain.com";

    const urls = [];

    // =========================
    // STATIC PAGES
    // =========================
    urls.push({ loc: `${baseUrl}/` });
    urls.push({ loc: `${baseUrl}/blog` });

    // =========================
    // BLOG
    // =========================
    posts.forEach((p) => {
      urls.push({
        loc: `${baseUrl}/blog/${p.slug}`,
        lastmod: p.updatedAt
          ? new Date(p.updatedAt).toISOString()
          : null,
      });
    });

    categories.forEach((c) => {
      urls.push({
        loc: `${baseUrl}/category/${c.slug}`,
      });
    });

    tags.forEach((t) => {
      urls.push({
        loc: `${baseUrl}/tag/${t.slug}`,
      });
    });

    // =========================
    // CITY PAGES
    // =========================
    cities.forEach((city) => {
      urls.push({
        loc: `${baseUrl}/city/${city.slug}`,
        lastmod: city.updatedAt
          ? new Date(city.updatedAt).toISOString()
          : null,
      });
    });

    // =========================
    // SERVICE PAGES (CITY-WISE)
    // =========================
    services.forEach((service) => {
      if (service.seo && service.seo.noIndex) return;

      service.serviceAreas &&
        service.serviceAreas.forEach((cityId) => {
          const city = cities.find(
            (c) => c._id.toString() === cityId.toString()
          );

          if (city) {
            urls.push({
              loc: `${baseUrl}/city/${city.slug}/${service.slug}`,
              lastmod: service.updatedAt
                ? new Date(service.updatedAt).toISOString()
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
