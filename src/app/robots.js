// /app/robots.ts
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/login", "/sign-up"],
      },
    ],
    sitemap: "https://truefeelings.in/sitemap.xml",
  };
}
