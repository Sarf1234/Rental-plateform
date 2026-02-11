import Link from "next/link";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

export const dynamic = "force-dynamic";

/* =========================
   SEO METADATA
========================= */
export const metadata = {
  title:
    "Event & Wedding Rental Guides, Ideas & Planning Tips | YourBrandName",
  description:
    "Explore expert guides on wedding planning, tent house rentals, decor ideas, catering costs, event checklists and budgeting tips. YourBrandName helps you plan events smarter across Indian cities.",
  openGraph: {
    title:
      "Event & Wedding Rental Guides & Planning Tips | YourBrandName",
    description:
      "Wedding planning tips, tent house cost guides, decor trends, catering budgeting and complete event rental insights for Indian cities.",
    url: "/blog",
    type: "website",
  },
};

export default async function AllPostsPage() {
  let posts = [];

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?page=1&limit=50`
    );
    posts = res.data || [];
  } catch (err) {
    console.error("SSR posts fetch failed:", err);
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: "YourBrandName",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${baseUrl}/blog`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/blog`,
        name: "Event & Wedding Rental Blog",
        description:
          "Planning guides, rental pricing insights, decor trends, catering cost breakdowns and city-specific event planning resources.",
      },
      {
        "@type": "ItemList",
        name: "Event Planning & Rental Guides",
        itemListElement: posts.slice(0, 20).map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/blog/${post.slug}`,
          name: post.title,
        })),
      },
    ],
  };

  return (
    <section className="relative bg-slate-50 overflow-hidden">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="max-w-7xl mx-auto px-4  py-20">

        {/* PRIMARY SEO H1 */}
        <h1 className="text-lg sm:text-xl text-center mt-8 lg:text-2xl font-extrabold text-gray-900 mb-4">
          Event & Wedding Rental Guides, Ideas & Planning Tips
        </h1>

        {/* Supporting SEO paragraph */}
        <p className="text-gray-600 max-w-3xl text-center m-auto mb-12 text-base sm:text-lg">
          Discover expert wedding planning tips, tent house rental cost
          breakdowns, decor inspiration, catering budgeting guides, and
          practical event checklists. Our marketplace connects you with
          verified rental providers across cities while helping you plan
          smarter and save more.
        </p>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No event planning articles available right now.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="
                  group rounded-3xl overflow-hidden
                  bg-white
                  border border-gray-200
                  hover:border-black
                  hover:shadow-xl
                  transition-all duration-300
                "
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={post.coverImage || "/placeholder.png"}
                    alt={post.title}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5">

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories?.map((cat) => (
                      <span
                        key={cat._id}
                        className="
                          text-[11px] px-3 py-1 rounded-full
                          bg-gray-100 text-gray-700 font-medium
                        "
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="
                    text-lg font-semibold text-gray-900 leading-snug
                    group-hover:text-black transition
                  ">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex justify-between items-center mt-5 text-xs text-gray-500">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span>{post.readTime || 3} min read</span>
                  </div>
                </div>
              </Link>
            ))}

          </div>
        )}
      </div>
    </section>
  );
}
