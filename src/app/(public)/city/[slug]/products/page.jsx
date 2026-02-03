import Services from '@/components/layout/Services';
import { imagesLink, carouselContent } from '../../../../../utils/seedData'
import HeroCarousel from '@/components/layout/HeroCrousel';
import { apiRequest } from '@/lib/api';
import FlagsCards from '@/components/ui/public/FlagsCards';




export default async function CityHome({ params }) {
   const { slug } = await params;
   let featured = [];
   let top = [];
   let best = [];
   let all = [];
   let newproudct = [];
   
     try {
       const res = await apiRequest(
         `${process.env.NEXT_PUBLIC_API_URL}/api/products?city=${slug}&page=1&limit=10`
       );
       featured = res.featured || [];
       top = res.top || [];
       best = res.best || [];
       all = res.all || [];
       newproudct = res.new ||[]
     } catch (err) {
       console.error("Failed to fetch products:", err);
     }

  const cityName = slug.replace("-", " ");

  return (
    <div className="min-h-screen mt-16">
      <HeroCarousel images={imagesLink} contents={carouselContent} />
      <Services />
      <FlagsCards data={featured} title="Featured Services" citySlug={slug}/>
      <FlagsCards data={top} title=" Top Services" citySlug={slug}/>
      <FlagsCards data={best} title=" Best Services" citySlug={slug}/>
      <FlagsCards data={newproudct} title=" Best Services" citySlug={slug}/>

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
