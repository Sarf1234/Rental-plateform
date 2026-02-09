import Services from "@/components/layout/Services";
import { imagesLink, carouselContent } from "../../../../utils/seedData";
import HeroCarousel from "@/components/layout/HeroCrousel";
import Servicecards from "@/components/ui/public/Servicecards";
import { apiRequest } from "@/lib/api";
import ProductCategories from "@/components/ui/public/ProductCategories";

export default async function CityHome({ params }) {
  const { slug } = await params;
  let featured = [];
  let top = [];
  let best = [];
  let all = [];

  let categories = [];

  try {
    const catRes = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/categories`,
    );
    categories = catRes?.data || [];
  } catch (err) {
    console.error("Failed to fetch product categories:", err);
  }

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/service?city=${slug}&page=1&limit=10`,
    );
    featured = res.featured || [];
    top = res.top || [];
    best = res.best || [];
    all = res.all || [];
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
  console.log(slug);

  const cityName = slug.replace("-", " ");

  return (
    <div className="min-h-screen mt-16">
      <HeroCarousel images={imagesLink} contents={carouselContent} />
      <Services city={slug} />
      <ProductCategories categories={categories} citySlug={slug} />
      <Servicecards
        data={featured}
        title="Featured Wedding Rentals in Patna"
        subtitle="Handpicked decoration and event rental services trusted by 500+ customers."
        citySlug={slug}
      />

      <Servicecards
        data={top}
        title="Most Booked Rental Services"
        subtitle="Our top-performing and highest-rated rental packages."
        citySlug={slug}
      />

      <Servicecards
        data={best}
        title="Premium & Luxury Rental Packages"
        subtitle="Exclusive high-end event setups for weddings, corporate events, and special occasions."
        citySlug={slug}
      />

      {/* HERO */}
      {/* <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Event Rentals in {cityName}
        </h1>
        <p className="max-w-xl mx-auto text-lg opacity-90">
          Book tents, chairs, decorations & more in {cityName}.
        </p>
      </section> */}

      {/* FEATURED */}
      {/* <section className="py-16 px-6">
        <h2 className="text-2xl font-semibold mb-8">
          ⭐ Featured Services
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          
        </div>
      </section> */}

      {/* HOT DEALS */}
      {/* <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-2xl font-semibold mb-8">
          🔥 Hot Deals
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          
        </div>
      </section> */}

      {/* ALL SERVICES */}
      {/* <section className="py-16 px-6">
        <h2 className="text-2xl font-semibold mb-8">
          All Services in {cityName}
        </h2>
      </section> */}
    </div>
  );
}
