export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import Link from "next/link";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

export default async function HomePosts() {
  let posts = [];

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?page=1&limit=6`
    );
    posts = res.data || [];
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    return null;
  }

  if (!posts.length) return null;

  return (
    <section className="relative bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
            Latest AI Insights & Stories
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">
            Fresh, simple and practical AI content — learn how AI fits into real life and work.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              prefetch={false}
              className="group relative overflow-hidden rounded-2xl
                bg-white border border-gray-100
                shadow-sm hover:shadow-xl
                hover:-translate-y-1
                transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 sm:h-52 md:h-56">
                <Image
                  src={post.coverImage || "/placeholder.png"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={index < 2 ? "eager" : "lazy"}
                />

                {/* subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories?.map((cat) => (
                    <span
                      key={cat._id}
                      className="text-[11px] px-2 py-1 rounded-full
                        bg-indigo-50 text-indigo-700 font-medium"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-gray-900
                  leading-snug group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-medium">
                    {post.readTime || 3} min read
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3
              rounded-lg bg-indigo-600 text-white font-semibold
              shadow-md hover:bg-indigo-700 hover:shadow-lg
              active:scale-95 transition-all"
          >
            Browse All Articles →
          </Link>
        </div>

      </div>
    </section>
  );
}
