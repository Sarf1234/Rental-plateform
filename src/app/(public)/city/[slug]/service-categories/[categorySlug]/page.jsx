import { apiRequest } from "@/lib/api";
import Servicecards from "@/components/ui/public/Servicecards";
import { notFound } from "next/navigation";
import ServiceCard from "@/components/ui/public/ServiceProductCard";

export const revalidate = 3600;

// ===============================
// 🔥 Dynamic Metadata
// ===============================
export async function generateMetadata({ params }) {
  const { slug, categorySlug } = await params;


  try {
    const [cityRes, categoryRes] = await Promise.all([
      apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`),
      apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${categorySlug}`,
      ),
    ]);

    const city = cityRes?.data;
    const category = categoryRes?.data;

    if (!city || !category) return {};

    const title = `${category.name} Services in ${city.name} | YourBrand`;
    const description = `Explore professional ${category.name.toLowerCase()} services in ${city.name}. Trusted vendors, transparent pricing and complete event solutions.`;

    const canonicalUrl = `https://yourdomain.com/city/${slug}/service-categories/${categorySlug}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "YourBrand",
        type: "website",
        locale: "en_IN",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (err) {
    return {};
  }
}

// ===============================
// 🔥 Page Component
// ===============================
export default async function ServiceCategoryPage({ params }) {
  const { slug, categorySlug } = await params;
 
  const baseUrl = "https://yourdomain.com";

  // 🔹 Fetch City
  const cityRes = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`,
  );
  const city = cityRes?.data;
  if (!city) return notFound();

  // 🔹 Fetch Category
  const categoryRes = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${categorySlug}`,
  );
  const category = categoryRes?.data;
  if (!category) return notFound();

  // 🔹 Fetch Services
  const servicesRes = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${categorySlug}/services?city=${slug}`,
  );
  const services = servicesRes?.data || [];


  // ===============================
  // 🔥 JSON-LD Structured Data
  // ===============================

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // 🔹 Breadcrumb
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: city.name,
            item: `${baseUrl}/city/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.name,
            item: `${baseUrl}/city/${slug}/service-categories/${categorySlug}`,
          },
        ],
      },

      // 🔹 ItemList (Services)
      {
        "@type": "ItemList",
        name: `${category.name} Services in ${city.name}`,
        itemListElement: services.slice(0, 20).map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/city/${slug}/${service.slug}`,
          name: service.title,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen mt-16">
      {/* 🔥 JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* 🔥 SEO Heading Section */}
      <section className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {category.name} Services in {city.name}
        </h1>

        {category.description && (
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </section>

      {/* 🔥 Services Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {services?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {services?.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                citySlug={slug}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 py-10">No services available.</div>
        )}
      </section>

      {/* 🔥 Empty State */}
      {services.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No services available in this category for {city.name}.
        </div>
      )}
    </div>
  );
}
