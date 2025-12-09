import Link from "next/link";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function TagsSection() {
  let tags = [];

  try {
    const res = await apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`);
    tags = res.data || [];
  } catch (err) {
    console.error("Failed to fetch tags:", err);
  }

  if (!tags.length) return null;

  return (
    <section className="relative py-16">
      {/* Ambient AI glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-600 text-center mb-4">
          Explore Topics & Tags
        </h2>
        <p className="text-sm sm:text-base text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Discover AI guides, prompts, tools, automation ideas, and real-world applications — organized by topic.
        </p>

        {/* Tags Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tags.map((tag) => (
            <Link
              key={tag._id}
              href={`/tag/${tag.slug}`}
              className="
                group relative overflow-hidden 
                rounded-2xl 
                bg-[#0F172A] 
                border border-white/10
                hover:border-sky-400/40
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              {/* Image */}
              <div className="relative h-44 w-full">
                <Image
                  src={
                    tag.coverImage ||
                    "https://res.cloudinary.com/dsc5aznps/image/upload/v1764423345/posts/b4h68sz4bxoy5g9tcecl.png"
                  }
                  alt={tag.name}
                  fill
                  sizes="(max-width: 768px) 100vw,
                         (max-width: 1200px) 50vw,
                         25vw"
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
                  {tag.description || "Explore AI content related to this topic."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
