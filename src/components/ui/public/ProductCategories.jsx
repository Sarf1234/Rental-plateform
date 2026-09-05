import Link from "next/link";
import {
  Palette,
  MonitorPlay,
  Building2,
  Armchair,
  Lightbulb,
  Heart,
  Volume2,
  Sparkles,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CATEGORY_ICONS = {
  "decor-styling": Palette,
  "electronics-and-av-equipment": MonitorPlay,
  "fabrication-and-exhibition-stalls": Building2,
  furniture: Armchair,
  "lighting-equipment": Lightbulb,
  "mandap-and-wedding": Heart,
  "sound-systems": Volume2,
  "special-effects": Sparkles,
};

const CATEGORY_COLORS = {
  "decor-styling": {
    bg: "bg-amber-50",
    icon: "text-amber-600",
  },

  "electronics-and-av-equipment": {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
  },

  "fabrication-and-exhibition-stalls": {
    bg: "bg-orange-50",
    icon: "text-orange-600",
  },

  furniture: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
  },

  "lighting-equipment": {
    bg: "bg-yellow-50",
    icon: "text-yellow-600",
  },

  "mandap-and-wedding": {
    bg: "bg-rose-50",
    icon: "text-rose-600",
  },

  "sound-systems": {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
  },

  "special-effects": {
    bg: "bg-purple-50",
    icon: "text-purple-600",
  },
};

async function getProductCategories() {
  try {
    if (!API_URL) {
      console.error(
        "NEXT_PUBLIC_API_URL is not configured"
      );
      return [];
    }

    const response = await fetch(
      `${API_URL}/api/products/categories`,
      {
        next: {
          revalidate: 604800,
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

    return Array.isArray(result?.data)
      ? result.data
      : [];
  } catch (error) {
    console.error(
      "Failed to fetch product categories:",
      error
    );

    return [];
  }
}

export default async function ProductCategories({
  citySlug,
}) {
  const categories =
    await getProductCategories();

  if (!categories.length) return null;

  return (
    <section
      aria-label="Rental categories"
      className="
        w-full
        border-b
        border-slate-200
        
      "
    >
      <div className="w-full">

        <div
          className="
            flex
            w-full
            items-center

            overflow-x-auto
            overflow-y-hidden

            px-2
            sm:px-3
            lg:px-4

            md:py-2
            sm:py-0

            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          <div
            className="
              flex
              w-full
              min-w-max
              items-center

              gap-2
              sm:gap-2
            "
          >

            {categories.map((category) => {
              const Icon =
                CATEGORY_ICONS[category.slug] ||
                Sparkles;

              const colors =
                CATEGORY_COLORS[category.slug] || {
                  bg: "bg-slate-100",
                  icon: "text-slate-600",
                };

              // First word only
              const label =
                category.name
                  ?.trim()
                  ?.split(/\s+/)[0] ||
                category.name;

              return (
                <Link
                  key={
                    category._id ||
                    category.slug
                  }
                  href={`/${citySlug}/categories/${category.slug}`}
                  title={category.name}
                  aria-label={`Browse ${category.name}`}
                  className="
                    group
                    relative

                    flex
                    flex-1
                    flex-shrink-0

                    min-w-[82px]
                    sm:min-w-[105px]
                    md:min-w-[115px]

                    items-center
                    justify-center

                    px-2
                    sm:px-3

                    py-2
                    sm:py-2

                    transition-all
                    duration-200

                    active:scale-[0.96]

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#003459]
                    focus-visible:ring-inset
                  "
                >

                  {/* CATEGORY CONTENT */}

                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center

                      gap-1.5

                      sm:flex-row
                      sm:gap-2
                    "
                  >

                    {/* CATEGORY ICON */}

                    <span
                      className={`
                        flex

                        h-10
                        w-10

                        sm:h-10
                        sm:w-10

                        flex-shrink-0

                        items-center
                        justify-center

                        rounded-full

                        ${colors.bg}

                        transition-transform
                        duration-200

                        group-hover:scale-105
                      `}
                    >
                      <Icon
                        size={19}
                        strokeWidth={1.8}
                        className={colors.icon}
                      />
                    </span>

                    {/* LABEL */}

                    <span
                      className="
                        max-w-[76px]

                        text-center

                        text-[11px]
                        sm:text-xs
                        md:text-[13px]

                        font-semibold
                        leading-none

                        text-slate-700

                        transition-colors
                        duration-200

                        group-hover:text-[#003459]

                        truncate
                      "
                    >
                      {label}
                    </span>

                  </div>

                  {/* ACTIVE / HOVER INDICATOR */}

                  <span
                    className="
                      absolute
                      bottom-0
                      left-1/2

                      h-[2px]
                      w-0

                      -translate-x-1/2

                      rounded-full

                      bg-[#003459]

                      transition-all
                      duration-200

                      group-hover:w-8
                    "
                  />

                </Link>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
}