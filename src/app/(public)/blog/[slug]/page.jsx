import Image from "next/image";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export const dynamic = "force-dynamic";

/* =========================
   ✅ Dynamic SEO Metadata
========================= */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  let post;

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${slug}`
    );
    post = res.data;
  } catch {
    return {
      title: "AI Article Not Found | IndiaAIMag",
      description: "This AI article does not exist.",
    };
  }

  const title = post.metaTitle || post.title;
  const description =
    post.metaDescription ||
    post.excerpt ||
    "Read practical AI guides, tutorials, tools and real-world use cases on IndiaAIMag.";

  const canonicalUrl = `https://kiraynow.com/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: post.coverImage || "/placeholder.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.coverImage || "/placeholder.png"],
    },
  };
}

/* =========================
   ✅ Page Layout
========================= */
export default async function SinglePostPage({ params }) {
  const { slug } = await params;
  let post;

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${slug}`
    );
    post = res.data;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h1 className="text-2xl font-semibold text-gray-700">
          Article not found
        </h1>
      </div>
    );
  }

  return (
    <article className="bg-slate-50 pb-24">

      {/* ================= HERO ================= */}
      <section className="relative h-[42vh] sm:h-[52vh] w-full overflow-hidden">
        <Image
          src={post.coverImage || "/placeholder.png"}
          alt={post.title}
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 text-center">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-sm text-gray-600">
            {new Date(post.createdAt).toLocaleDateString()} ·{" "}
            {post.readTime || 3} min read
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-0 sm:px-6 -mt-12">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl py-8 px-4 sm:p-12">

         

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-lg mt-12 text-gray-700 italic border-l-4 border-indigo-500 pl-5 mb-12">
              {post.excerpt}
            </p>
          )}

          {/* ================= ARTICLE BODY ================= */}
          <div
            className="
              content
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ================= INTERNAL LINKS ================= */}
          {post.internalLinks?.length > 0 && (
            <div className="mt-16 pt-10 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Related Articles
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {post.internalLinks.map((link) => (
                  <Link
                    key={link.url}
                    href={link.url}
                    className="
                      block p-4 rounded-xl border
                      bg-slate-50 hover:bg-indigo-50
                      border-gray-200 hover:border-indigo-300
                      transition
                    "
                  >
                    <div className="font-medium text-gray-800 hover:text-indigo-700">
                      {link.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Read related guide →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAGS ================= */}
          {post.tags?.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-gray-800 font-semibold mb-4">
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Link
                    key={tag._id}
                    href={`/tag/${tag.slug}`}
                    className="
                      text-xs px-3 py-1 rounded-full
                      bg-slate-100 text-gray-700
                      hover:bg-indigo-50 hover:text-indigo-600
                      transition
                    "
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
               {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.categories?.map((cat) => (
              <span
                key={cat._id}
                className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium"
              >
                {cat.name}
              </span>
            ))}
          </div>
            </div>
          )}
        </div>

        {/* ================= BACK ================= */}
        <div className="text-center mt-14">
          <Link
            href="/blog"
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-lg
              bg-indigo-600 text-white font-semibold
              hover:bg-indigo-700 transition
            "
          >
            ← Back to AI Blogs
          </Link>
        </div>
      </div>
    </article>
  );
}
