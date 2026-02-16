import { apiRequest } from "@/lib/api";
import { notFound } from "next/navigation";
import ServiceCard from "@/components/ui/public/ServiceProductCard";

export const revalidate = 3600;

/* ===============================
   🔥 Dynamic Metadata
================================ */
export async function generateMetadata({ params }) {
  const { slug, categorySlug } = await params;

  const baseUrl = "https://kiraynow.com";

  try {
    const [cityRes, categoryRes] = await Promise.all([
      apiRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`),
      apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${categorySlug}`
      ),
    ]);

    const city = cityRes?.data;
    const category = categoryRes?.data;

    if (!city || !category) {
      return {
        title: "Page Not Found",
        robots: { index: false, follow: false },
      };
    }

    const title = `${category.name} Services in ${city.name} | Book Trusted Vendors | KirayNow`;

    const description = `Book verified ${category.name.toLowerCase()} services in ${city.name} for weddings, birthdays, corporate events and celebrations. Transparent pricing, professional setup and reliable service providers available across the city.`;

    const url = `${baseUrl}/${slug}/service-categories/${categorySlug}`;

    const image =
      category.image ||
      "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp";

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      alternates: {
        canonical: url,
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
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (err) {
    return {};
  }
}

/* ===============================
   🔥 Page Component
================================ */
export default async function ServiceCategoryPage({ params }) {
  const { slug, categorySlug } = await params;
  const baseUrl = "https://kiraynow.com";

  // 🔹 Fetch City
  const cityRes = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`
  );
  const city = cityRes?.data;
  if (!city) return notFound();

  // 🔹 Fetch Category
  const categoryRes = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${categorySlug}`
  );
  const category = categoryRes?.data;
  if (!category) return notFound();

  // 🔹 Fetch Services
  const servicesRes = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${categorySlug}/services?city=${slug}`
  );
  const services = servicesRes?.data || [];

  const categoryUrl = `${baseUrl}/${slug}/service-categories/${categorySlug}`;

  /* ===============================
     🔥 Structured Data
  ================================ */

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // 🔹 Website
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "KirayNow",
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },

      // 🔹 Organization
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "KirayNow",
        url: baseUrl,
        logo:
          "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
      },

      // 🔹 Breadcrumb
      {
        "@type": "BreadcrumbList",
        "@id": `${categoryUrl}#breadcrumb`,
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
            item: `${baseUrl}/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.name,
            item: categoryUrl,
          },
        ],
      },

      // 🔹 Collection Page
      {
        "@type": "CollectionPage",
        "@id": categoryUrl,
        name: `${category.name} Services in ${city.name}`,
        description: `Explore professional ${category.name.toLowerCase()} services in ${city.name}.`,
        url: categoryUrl,
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
      },

      // 🔹 Services List
      {
        "@type": "ItemList",
        name: `${category.name} Services in ${city.name}`,
        itemListElement: services.slice(0, 20).map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/${slug}/${service.slug}`,
          name: service.title,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen mt-16">
      {/* 🔥 JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* 🔥 Heading Section */}
      <section className="max-w-7xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {category.name} Services in {city.name}
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Discover trusted and verified {category.name.toLowerCase()} services in {city.name}. 
          Compare pricing, explore packages and book reliable vendors for your upcoming event.
        </p>
      </section>

      {/* 🔥 Services Grid */}
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
