import Link from "next/link";
import { apiRequest } from "@/lib/api";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function CategoriesSection() {
  let categories = [];

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
    );
    categories = res.data || [];
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }

  if (!categories.length) return null;

  return (
    <section className="relative bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14">

        {/* Soft AI background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_60%)]" />

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center">
          Explore AI Categories
        </h2>

        <p className="mt-3 text-sm sm:text-base text-gray-600 text-center max-w-2xl mx-auto">
          Beginner-friendly AI topics, automation guides, tools, prompts and real-world AI use cases.
        </p>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              prefetch={false}
              className="
                group rounded-xl px-4 py-3
                bg-white
                border border-gray-200
                text-sm font-medium text-gray-800 text-center
                shadow-sm
                hover:border-indigo-400
                hover:shadow-md
                hover:-translate-y-0.5
                transition-all duration-200
                active:scale-[0.98]
              "
            >
              <span className="relative z-10 group-hover:text-indigo-600 transition">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
