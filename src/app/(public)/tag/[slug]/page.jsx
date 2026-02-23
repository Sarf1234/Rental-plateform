import Link from "next/link";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

export const dynamic = "force-dynamic";

/* ================================
   ✅ SEO METADATA (NOINDEX TAGS)
================================ */

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tags/${slug}`
    );

    const tag = res.tag || res.data;

    if (!tag) return {};

    const tagName = tag.name;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    return {
      title: `${tagName} Articles & Related Posts`,
      description:
        tag.description ||
        `Explore curated blog posts related to ${tagName}. Read expert guides, tips and insights.`,

      robots: {
        index: false,   // ✅ IMPORTANT
        follow: true,
      },

      alternates: {
        canonical: `${siteUrl}/blog`, // ✅ prevent duplicate archive indexing
      },

      openGraph: {
        title: `${tagName} Blogs`,
        description:
          tag.description ||
          `Browse all blog posts tagged under ${tagName}.`,
        url: `${siteUrl}/blog/tag/${slug}`,
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: `${tagName} Blogs`,
        description:
          tag.description ||
          `Read latest blogs about ${tagName}.`,
      },
    };
  } catch (error) {
    return {};
  }
}

/* ================================
   ✅ TAG PAGE COMPONENT
================================ */

export default async function TagPage({ params }) {
  const { slug } = await params;

  let posts = [];
  let tag = null;

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tags/${slug}`
    );

    tag = res.tag || res.data;
    posts = res.data || [];
  } catch (err) {
    console.error("Failed to fetch tag posts:", err);
  }

  if (!tag) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        <h2 className="text-xl font-semibold">Tag not found</h2>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* ✅ HEADER */}
        <header className="text-center mb-14">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
            {tag.name} Articles & Insights
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Discover curated blog posts related to {tag.name}. Explore detailed
            guides, practical tips, and expert insights designed to help you
            stay informed and make better decisions.
          </p>
        </header>

        {/* ✅ POSTS GRID */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">
            No articles found for this topic.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl overflow-hidden
                bg-white border border-gray-200
                hover:border-indigo-300
                hover:-translate-y-1
                hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-52">
                  <Image
                    src={post.coverImage || "/placeholder.png"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5">

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.map((t) => (
                      <span
                        key={t._id}
                        className="text-[11px] px-3 py-1 rounded-full
                        bg-indigo-50 text-indigo-600 font-medium"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold text-gray-900
                    group-hover:text-indigo-600 transition">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-600 mt-3 line-clamp-3">
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