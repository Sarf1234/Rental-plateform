import Link from "next/link";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

export const dynamic = "force-dynamic";

/* ✅ SEO Metadata */
export const metadata = {
  title: "AI Blogs & Guides for Beginners – Tools, Tutorials & News | IndiaAIMag",
  description:
    "Browse AI blogs, beginner guides, tool tutorials, automation ideas, and the latest AI news. IndiaAIMag explains AI in simple language — practical, tested, and safe.",
  openGraph: {
    title: "AI Blogs & Guides for Beginners | IndiaAIMag",
    description:
      "Practical AI guides, tutorials, tools, and real-world use cases. Learn how to use AI effectively — no coding required.",
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

  return (
    <section className="relative bg-slate-50 overflow-hidden">
      {/* ✅ Soft AI glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.07),_transparent_65%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20">

        {/* ✅ PRIMARY SEO H1 */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
          AI Blogs, Guides & Practical Tutorials
        </h1>

        {/* ✅ Supporting SEO paragraph */}
        <p className="text-gray-600 max-w-3xl mb-12 text-base sm:text-lg">
          Discover beginner-friendly AI guides, step-by-step tutorials, tool reviews,
          automation ideas, and the latest AI news. IndiaAIMag helps you understand
          how to use AI in real life — safely and practically.
        </p>

        {/* ❌ Empty state */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No AI articles available right now.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                prefetch
                className="
                  group rounded-3xl overflow-hidden
                  bg-white
                  border border-gray-200
                  hover:border-indigo-300
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
                          bg-indigo-50 text-indigo-600 font-medium
                        "
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="
                    text-lg font-semibold text-gray-900 leading-snug
                    group-hover:text-indigo-600 transition
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
