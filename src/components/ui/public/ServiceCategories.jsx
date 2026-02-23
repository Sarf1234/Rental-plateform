import Link from "next/link";
import Image from "next/image";

export default function ServiceCategories({ categories = [], citySlug }) {
  if (!categories.length) return null;

  return (
    <section className="max-w-7xl mx-auto py-12 px-4">

      <div className="border-b-4 border-[#003459] inline-block pb-2 mb-8">
        <h2 className="text-2xl font-semibold">
          Browse Service Categories
        </h2>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">

        {categories
          .filter((cat) => cat.isActive)
          .map((category) => {

            const imageUrl =
              category.images?.[0] ||
              "https://via.placeholder.com/400x400?text=Service";

            return (
              <Link
                key={category._id}
                href={`/${citySlug}/service-categories/${category.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300"
              >

                {/* Image */}
                <div className="relative h-48 md:h-56 w-full">
                  <Image
                    src={imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">

                  <h3 className="text-lg md:text-xl font-semibold">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="text-xs md:text-sm mt-1 line-clamp-2 text-gray-200">
                      {category.description}
                    </p>
                  )}

                  <span className="inline-block mt-3 text-sm font-medium text-[#FFD166]">
                    Explore →
                  </span>

                </div>

              </Link>
            );
          })}

      </div>

    </section>
  );
}
