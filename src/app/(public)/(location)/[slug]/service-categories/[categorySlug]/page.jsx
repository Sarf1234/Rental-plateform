import { apiRequest } from "@/lib/api";
import { notFound } from "next/navigation";
import ServiceCard from "@/components/ui/public/ServiceProductCard";

export const revalidate = 3600;

/* =====================================
   🔥 DYNAMIC METADATA (ADMIN CONTROLLED)
===================================== */
export async function generateMetadata({ params }) {
  const { slug, categorySlug } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://kiraynow.com";

  try {
    const [cityRes, categoryRes] = await Promise.all([
      apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`),
      apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${categorySlug}`
      ),
    ]);

    const city = cityRes?.data;
    const category = categoryRes?.data;
    const categorySEO = category?.seo || {};

    if (!city || !category) {
      return {
        title: "Page Not Found",
        robots: { index: false, follow: false },
      };
    }

    const title =
      categorySEO?.metaTitle ||
      `${category.name} Services in ${city.name} | Book Trusted Vendors`;

    const description =
      categorySEO?.metaDescription ||
      `Book verified ${category.name.toLowerCase()} services in ${city.name}. Transparent pricing and reliable vendors available.`;

    const url =
      categorySEO?.canonicalUrl ||
      `${baseUrl}/${slug}/service-categories/${categorySlug}`;

    const image =
      category.image ||
      "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp";

    const shouldIndex = categorySEO?.noIndex ? false : true;

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      keywords: categorySEO?.metaKeywords || [],
      alternates: {
        canonical: url,
      },
      robots: {
        index: shouldIndex,
        follow: true,
      },
      openGraph: {
        title,
        description,
        url,
        siteName: "KirayNow",
        type: "website",
        locale: "en_IN",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: `${category.name} services in ${city.name}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (err) {
    console.error("Metadata error:", err);
    return {};
  }
}

/* =====================================
   🔥 PAGE COMPONENT
===================================== */
export default async function ServiceCategoryPage({ params }) {
  const { slug, categorySlug } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://kiraynow.com";

  const cityRes = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`
  );
  const city = cityRes?.data;
  if (!city) return notFound();

  const categoryRes = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${categorySlug}`
  );
  const category = categoryRes?.data;
  if (!category) return notFound();

  const servicesRes = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${categorySlug}/services?city=${slug}`
  );
  const services = servicesRes?.data || [];

  const categoryUrl = `${baseUrl}/${slug}/service-categories/${categorySlug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Services in ${city.name}`,
    url: categoryUrl,
  };

  return (
    <div className="min-h-screen mt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <section className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {category.name} Services in {city.name}
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Discover trusted and verified {category.name.toLowerCase()} services in{" "}
          {city.name}. Compare pricing and book reliable vendors for your event.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                citySlug={slug}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No services available in this category for {city.name}.
          </div>
        )}
      </section>
    </div>
  );
}