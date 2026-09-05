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
    <section
      className="
        max-w-7xl
        mx-auto

        px-4

        py-8
        md:py-10
      "
    >
      {/* =====================================
          SECTION HEADER
      ===================================== */}

      <div className="mb-5 md:mb-6">
        <div
          className="
            inline-flex

            border-b-2
            md:border-b-4

            border-[#003459]

            pb-1.5
            md:pb-2
          "
        >
          <h2
            className="
              text-xl
              md:text-2xl

              font-semibold
              leading-[1.25]

              text-gray-900
            "
          >
            {title}
          </h2>
        </div>

        {subtitle && (
          <p
            className="
              mt-2

              max-w-2xl

              text-xs
              sm:text-sm
              md:text-base

              leading-5
              md:leading-6

              text-gray-600
            "
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* =====================================
          BLOG GRID
      ===================================== */}

      <div
        className="
          grid

          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3

          gap-3
          sm:gap-4
          md:gap-6
        "
      >
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="
              group

              overflow-hidden

              rounded-xl
              md:rounded-2xl

              border
              border-gray-200

              bg-white

              shadow-sm

              transition-all
              duration-300

              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            {/* =================================
                IMAGE
            ================================= */}

            <div
              className="
                relative
                w-full

                h-40
                sm:h-44
                md:h-48

                overflow-hidden

                bg-gray-100
              "
            >
              <Image
                src={
                  post.coverImage ||
                  "/placeholder.png"
                }
                alt={post.title}
                fill
                sizes="
                  (max-width:640px) 100vw,
                  (max-width:768px) 50vw,
                  33vw
                "
                className="
                  object-cover

                  transition-transform
                  duration-500

                  group-hover:scale-105
                "
              />
            </div>

            {/* =================================
                CONTENT
            ================================= */}

            <div
              className="
                p-3
                sm:p-4
              "
            >
              {/* TITLE */}
              <h3
                className="
                  text-[13px]
                  sm:text-sm
                  md:text-base

                  font-semibold
                  leading-[1.3]

                  text-gray-900

                  line-clamp-2

                  transition-colors
                  duration-200

                  group-hover:text-[#003459]
                "
              >
                {post.title}
              </h3>

              {/* EXCERPT */}
              {post.excerpt && (
                <p
                  className="
                    mt-1.5
                    md:mt-2

                    text-[10px]
                    sm:text-xs
                    md:text-sm

                    leading-5
                    md:leading-6

                    text-gray-600

                    line-clamp-2
                  "
                >
                  {post.excerpt}
                </p>
              )}

              {/* META */}
              <div
                className="
                  mt-2.5
                  md:mt-4

                  text-[10px]
                  sm:text-[11px]
                  md:text-xs

                  leading-4

                  text-gray-500
                "
              >
                {new Date(
                  post.createdAt
                ).toLocaleDateString()}{" "}
                •{" "}
                {post.readTime || 3} min read
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}