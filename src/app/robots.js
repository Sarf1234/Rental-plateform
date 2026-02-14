// /app/robots.ts
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/login", "/sign-up", "/api/",],
      },
    ],
    sitemap: "https://kiraynow.com/sitemap.xml",
  };
}
