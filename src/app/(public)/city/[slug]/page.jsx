import Services from "@/components/layout/Services";
import { imagesLink, carouselContent } from "../../../../utils/seedData";
import HeroCarousel from "@/components/layout/HeroCrousel";
import Servicecards from "@/components/ui/public/Servicecards";
import { apiRequest } from "@/lib/api";
import ProductCategories from "@/components/ui/public/ProductCategories";

export const revalidate = 3600; // ISR (1 hour)

// 🔥 Dynamic Metadata Generator
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const cityRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`
    );

    const city = cityRes?.data;
    if (!city) return {};

    const subAreasText =
      city.subAreas?.slice(0, 2).map((a) => a.name).join(", ") || "";

    const title = `Event & Wedding Rentals in ${city.name} | YourBrand`;
    const description = `Book trusted event and wedding rental services in ${
      city.name
    }${subAreasText ? ` including ${subAreasText}` : ""}. Affordable pricing, verified vendors and professional event support.`;

    const url = `https://yourdomain.com/city/${city.slug}`;
    const ogImage = `https://yourdomain.com/og-${city.slug}.jpg`; 
    // Replace with your real OG generator or image

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        siteName: "YourBrand",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `Event rentals in ${city.name}`,
          },
        ],
        locale: "en_IN",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
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

export default async function CityHome({ params }) {
  const { slug } = await params;

  let featured = [];
  let top = [];
  let best = [];
  let all = [];
  let categories = [];
  let cityData = null;

  try {
    const cityRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`
    );
    cityData = cityRes?.data || null;
  } catch (err) {
    console.error("Failed to fetch city:", err);
  }

  try {
    const catRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/categories`
    );
    categories = catRes?.data || [];
  } catch (err) {
    console.error("Failed to fetch product categories:", err);
  }

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/service?city=${slug}&page=1&limit=10`
    );
    featured = res.featured || [];
    top = res.top || [];
    best = res.best || [];
    all = res.all || [];
  } catch (err) {
    console.error("Failed to fetch services:", err);
  }

  if (!cityData) {
    return <div className="mt-20 text-center">City not found</div>;
  }

  const cityName = cityData.name;
  const subAreas = cityData.subAreas || [];
  const totalServices = all.length;

  return (
    <div className="min-h-screen mt-16">

      {/* HERO */}
      <HeroCarousel images={imagesLink} contents={carouselContent} />

      

      {/* WHY CHOOSE US */}
      <Services
        city={cityName}
        subAreas={subAreas}
        totalServices={totalServices}
      />

      {/* FEATURED */}
      <Servicecards
        data={featured}
        title={`Featured Rental Services in ${cityName}`}
        subtitle={`Handpicked decoration and event rental services trusted by customers in ${cityName}.`}
        citySlug={slug}
      />

      {/* PRODUCT CATEGORIES */}
      <ProductCategories categories={categories} citySlug={slug} />

      

      {/* SEO H1 + SHORT INTRO */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl text-center md:text-3xl font-bold text-gray-900">
          Event & Wedding Rental Services in {cityName}
        </h1>
        <p className="mt-3 text-gray-600 text-center m-auto max-w-3xl">
          Book trusted rental services in {cityName}
          {subAreas.length > 0 && (
            <>
              {" "}including{" "}
              {subAreas.slice(0, 3).map((area, i) => (
                <span key={area._id}>
                  {area.name}
                  {i < Math.min(2, subAreas.length - 1) ? ", " : ""}
                </span>
              ))}
            </>
          )}
          . Explore {totalServices}+ verified service options with transparent pricing and professional event support.
        </p>
      </section>

      {/* TOP BOOKED */}
      <Servicecards
        data={top}
        title={`Most Booked Services in ${cityName}`}
        subtitle={`Our top-performing and highest-rated rental packages available across ${cityName}.`}
        citySlug={slug}
      />

      {/* PREMIUM */}
      <Servicecards
        data={best}
        title={`Premium & Luxury Rentals in ${cityName}`}
        subtitle={`Exclusive high-end event setups for weddings, corporate events, and special occasions in ${cityName}.`}
        citySlug={slug}
      />

      {/* SUB AREAS FOOTER BLOCK */}
      {subAreas.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold mb-4">
            Serving Areas in {cityName}
          </h2>
          <div className="flex flex-wrap gap-3">
            {subAreas.map((area) => (
              <span
                key={area._id}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700"
              >
                {area.name}
              </span>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
