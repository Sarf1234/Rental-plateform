import Link from "next/link";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

export default async function RelatedBlogs({
  title = "Event Planning Guides",
  subtitle = "Helpful blogs to plan your event better",
}) {
  let posts = [];

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?page=1&limit=3`
    );
    posts = res?.data || [];
  } catch (err) {
    console.error("Failed to fetch related blogs:", err);
  }

  if (!posts.length) return null;

  return (
    <section className="max-w-7xl mx-auto py-10">
      <div className="px-4">

        {/* Section Header */}
        <div className="border-b-4 border-[#003459] inline-block pb-2 mb-1">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {subtitle && (
          <p className="text-gray-600 mt-2 max-w-2xl mb-6">
            {subtitle}
          </p>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="
                group bg-white rounded-2xl overflow-hidden
                border border-gray-200
                hover:shadow-lg
                transition-all duration-300
              "
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.coverImage || "/placeholder.png"}
                  alt={post.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-4">

                <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#003459] transition">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="mt-4 text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()} •{" "}
                  {post.readTime || 3} min read
                </div>

              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}
