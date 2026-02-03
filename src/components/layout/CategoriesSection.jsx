import Link from "next/link";
import { apiRequest } from "@/lib/api";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function CategoriesSection() {
  let categories = [];

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tags`
    );
    categories = res.data || [];
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }

  if (!categories.length) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">

      {/* Soft AI background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_65%)]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20">

        {/* Heading + Content */}
        <div className="text-center max-w-3xl mx-auto">
  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
    Browse Rental Categories
  </h2>

  <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
    Find furniture, electronics, event items, office equipment and more —
    all available for short-term and long-term rental at affordable prices.
  </p>
</div>

        {/* Categories Grid */}
        <div className="mt-14 grid grid-cols-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              prefetch={false}
              className="
                group relative
                rounded-2xl px-4 py-4
                bg-white/70 backdrop-blur
                border border-slate-200
                text-sm font-semibold text-slate-800 text-center
                shadow-sm
                transition-all duration-300 ease-out
                hover:-translate-y-1
                hover:shadow-xl
                hover:border-indigo-400
                active:scale-[0.97]
              "
            >
              {/* Hover Gradient Glow */}
              <span
                className="
                  absolute inset-0 rounded-2xl
                  bg-gradient-to-br from-indigo-500/10 to-violet-500/10
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                "
              />

              {/* Category Name */}
              <span className="relative z-10 whitespace-nowrap overflow-x-hidden group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </span>

              {/* Micro hint (UX + SEO) */}
              {/* <span className="relative z-10 mt-1 block text-[11px] text-slate-500 group-hover:text-indigo-500 transition">
                View guides →
              </span> */}
            </Link>
          ))}

        </div>

        {/* Bottom trust line */}
        <div className="mt-14 text-center text-sm text-slate-500">
  Flexible plans, transparent pricing and fast delivery —{" "}
  <span className="font-medium text-slate-700">
    rent smart, save more.
  </span>
</div>

      </div>
    </section>
  );
}
