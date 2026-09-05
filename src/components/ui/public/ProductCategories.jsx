import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getProductCategories() {
  try {
    if (!API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not configured");
      return [];
    }

    const response = await fetch(
      `${API_URL}/api/products/categories`,
      {
        next: {
          revalidate: 604800, // 7 days
          tags: ["product-categories"],
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`
      );

      return [];
    }

    const result = await response.json();

    return Array.isArray(result?.data) ? result.data : [];
  } catch (error) {
    console.error("Failed to fetch product categories:", error);
    return [];
  }
}

export default async function ProductCategories({ citySlug }) {
  const categories = await getProductCategories();

  if (!categories.length) return null;

  return (
    <section
      aria-label="Rental product categories"
      className="w-full bg-white border-y border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">

        {/* 
          Mobile / tablet:
          Horizontal category rail

          Large desktop:
          Compact 8-column layout
        */}
        <div
          className="
            flex xl:grid xl:grid-cols-8
            items-stretch
            gap-2
            xl:gap-0

            overflow-x-auto xl:overflow-visible

            py-2
            md:py-2.5
            xl:py-2

            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden

            snap-x
            snap-mandatory
          "
        >
          {categories.map((category) => (
            <Link
              key={category._id || category.slug}
              href={`/${citySlug}/categories/${category.slug}`}
              className="
                group
                relative
                flex-shrink-0
                snap-start

                min-w-[132px]
                sm:min-w-[148px]
                md:min-w-[160px]

                xl:min-w-0

                min-h-[44px]
                md:min-h-[48px]
                xl:min-h-[52px]

                px-3
                md:px-4
                xl:px-3

                flex
                items-center
                justify-center

                rounded-lg
                xl:rounded-none

                border
                border-gray-200
                xl:border-0
                xl:border-r
                xl:last:border-r-0

                bg-white

                text-[12px]
                sm:text-[13px]
                md:text-sm
                font-medium
                leading-tight
                text-center
                text-gray-700

                transition-colors
                duration-200

                hover:text-[#003459]
                hover:bg-[#f7fafc]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#003459]
                focus-visible:ring-offset-1
              "
            >
              <span className="line-clamp-2">
                {category.name}
              </span>

              {/* Desktop active/hover indicator */}
              <span
                className="
                  absolute
                  left-1/2
                  bottom-0

                  h-[2px]
                  w-0

                  -translate-x-1/2

                  bg-[#003459]

                  transition-all
                  duration-200

                  group-hover:w-8
                "
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}