"use client";

import Link from "next/link";

export default function ProductCategories({ categories = [], citySlug }) {
  if (!categories.length) return null;

  return (
    <section className="max-w-7xl mx-auto py-12 px-4">

      <div className="border-b-4 border-[#003459] inline-block pb-2 mb-8">
        <h2 className="text-2xl font-semibold">
          Browse Rental Categories
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/${citySlug}/categories/${category.slug}`}
            className="group border rounded-2xl p-6 bg-white hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >
            <div className="flex flex-col justify-between h-full">

              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition">
                  {category.name}
                </h3>

                {category.parent && (
                  <p className="text-xs text-gray-500 mt-1">
                    Under {category.parent.name}
                  </p>
                )}
              </div>

              <div className="mt-4 text-sm text-[#003459] font-medium">
                Explore →
              </div>

            </div>
          </Link>
        ))}

      </div>

    </section>
  );
}
