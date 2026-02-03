import Link from "next/link";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// ✅ Stable fallback images (1:1)
export const tagImages = [
  "https://res.cloudinary.com/dsc5aznps/image/upload/v1767976803/posts/d05fpzilbv3m0pfgfla3.png",
  "https://res.cloudinary.com/dsc5aznps/image/upload/v1767976841/posts/njv49drtda7ncxqdwjng.png",
  "https://res.cloudinary.com/dsc5aznps/image/upload/v1767977034/posts/e0wwzu1uymneh8eqnoj5.png",
  "https://res.cloudinary.com/dsc5aznps/image/upload/v1767976898/posts/pm6kkz2wbhwwfngb4hiy.png",
  "https://res.cloudinary.com/dsc5aznps/image/upload/v1767977060/posts/hzwwwxruqrcwywcgu9v8.png",
  "https://res.cloudinary.com/dsc5aznps/image/upload/v1767976927/posts/djad5orh6syvoff0kb1e.png",
  "https://res.cloudinary.com/dsc5aznps/image/upload/v1767976955/posts/jcoysbfvvwsorjfm6nv8.png",
  "https://res.cloudinary.com/dsc5aznps/image/upload/v1767977003/posts/wdk90w0rfaydp9wokglv.png",
  "https://res.cloudinary.com/dsc5aznps/image/upload/v1767976870/posts/sjiqyqttzllutptavf2x.png",
 
];

export default async function TagsSection() {
  let tags = [];

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
    );
    tags = res.data || [];
  } catch (err) {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
    console.error("Failed to fetch tags:", err);
  }

  if (!tags.length) return null;

  return (
    <section className="relative py-16">
      {/* Ambient AI glow (no CLS impact) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-700 text-center mb-4">
  Explore Rental Solutions
</h2>

<p className="text-sm sm:text-base text-gray-500 text-center max-w-2xl mx-auto mb-12">
  Discover furniture, electronics, event items, office equipment and more —
  available for short-term and long-term rental. Choose the right option
  based on your budget, duration and usage needs.
</p>

        {/* Tags Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tags.map((tag, index) => {
            const imageSrc = tagImages[index % tagImages.length];

            return (
              <Link
                key={tag._id}
                href={`/tag/${tag.slug}`}
                className="
                  group relative overflow-hidden
                  rounded-2xl
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >
                {/* Image wrapper with fixed aspect ratio (NO CLS) */}
                <div className="relative w-full aspect-square">
                  <Image
                    src={imageSrc}
                    alt={tag.name}
                    fill
                    sizes="(max-width: 640px) 100vw,
                           (max-width: 1024px) 50vw,
                           25vw"
                    priority={index < 2} // ✅ only top images
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 p-4">
                  <h3 className="text-gray-100 text-lg font-bold leading-tight">
                    {tag.name}
                  </h3>

                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                    {tag.description ||
                      "Explore AI content related to this topic."}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
