import Services from "@/components/layout/Services";
import { imagesLink, carouselContent } from "../../../../../utils/seedData";
import HeroCarousel from "@/components/layout/HeroCrousel";
import { apiRequest } from "@/lib/api";
import FlagsCards from "@/components/ui/public/FlagsCards";

export const revalidate = 3600;


export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";

    const cityRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`,
      { next: { revalidate: 3600 } }
    );

    const cityData = await cityRes.json();
    const city = cityData?.data;

    if (!city) {
      return {
        title: "City Not Found",
        robots: { index: false, follow: false },
      };
    }

    const cityName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const brandName = "YourBrandName"; // replace later

    const title = `Rental Products in ${cityName} | Event Items on Rent | ${brandName}`;

    const description = `Explore premium rental products in ${cityName} including event furniture, lighting, sound systems, decor items and more. Affordable pricing and verified providers available across ${
      city?.subAreas?.length
        ? city.subAreas.slice(0, 3).map((a) => a.name).join(", ")
        : cityName
    }.`;

    const url = `${baseUrl}/city/${slug}/products`;

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
        type: "website",
        images: [
          {
            url: `${baseUrl}/default-product-og.jpg`, // replace later
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${baseUrl}/default-product-og.jpg`],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: "Rental Products",
      description: "Event rental products available.",
    };
  }
}


export default async function CityProductsPage({ params }) {
  const { slug } = await params;

  let featured = [];
  let top = [];
  let best = [];
  let all = [];
  let newProduct = [];
  let cityData = null;

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?city=${slug}&page=1&limit=10`
    );

    featured = res?.featured || [];
    top = res?.top || [];
    best = res?.best || [];
    all = res?.all || [];
    newProduct = res?.new || [];
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  try {
    const cityRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${slug}`
    );
    cityData = cityRes?.data || null;
  } catch (err) {
    console.error("Failed to fetch city:", err);
  }

  // Proper city formatting (supports multi-word slugs)
  const cityName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const totalProducts = all.length;

  return (
    <div className="min-h-screen mt-16">

      {/* HERO */}
      <HeroCarousel images={imagesLink} contents={carouselContent} />

      {/* 🔹 SEO H1 + INTRO */}
      <section className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Rental Products in {cityName}
        </h1>

        <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
          Explore {totalProducts}+ rental products available in {cityName}. 
          From event furniture and lighting to sound systems and decor, 
          find reliable and affordable rental options for your celebration.
        </p>
      </section>

      

      {/* FEATURED */}
      {featured.length > 0 && (
        <FlagsCards
          data={featured}
          title={`Featured Rental Products in ${cityName}`}
          citySlug={slug}
        />
      )}

      {/* WHY SECTION */}
      <Services
        city={cityName}
        subAreas={cityData?.subAreas || []}
        totalServices={20}
      />

      {/* TOP */}
      {top.length > 0 && (
        <FlagsCards
          data={top}
          title={`Most Booked Products in ${cityName}`}
          citySlug={slug}
        />
      )}

      {/* BEST */}
      {best.length > 0 && (
        <FlagsCards
          data={best}
          title={`Premium Rental Products in ${cityName}`}
          citySlug={slug}
        />
      )}

      {/* NEW */}
      {newProduct.length > 0 && (
        <FlagsCards
          data={newProduct}
          title={`New Rental Products in ${cityName}`}
          citySlug={slug}
        />
      )}

      {/* EMPTY STATE */}
      {totalProducts === 0 && (
        <div className="text-center py-12 text-gray-500">
          No rental products available in {cityName} yet.
        </div>
      )}

    </div>
  );
}
