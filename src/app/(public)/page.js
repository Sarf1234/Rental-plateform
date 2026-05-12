import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import RelatedBlogs from "@/components/layout/RelatedBlogs";
import HeroCarousel from "@/components/layout/HeroCrousel";

export const revalidate = 604800; // 7 days SSG
export const dynamic = "force-static";

export const metadata = {
  title: "Event & Party Rentals Across India | KirayNow",
  description:
    "Book birthday decoration, wedding setup, tent house, furniture and event rental services across India with verified vendors.",
};
export default async function HomePage() {
const [cityRes, bannerRes] =
  await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cities?page=1&limit=100`,
      {
        next: {
          revalidate: 604800,
        },
      }
    ),

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/banners?placement=homepage`,
      {
        next: {
          revalidate: 3600,
        },
      }
    ),
  ]);

const cityData =
  await cityRes.json();

const bannerData =
  await bannerRes.json();

const cities =
  cityData?.data || [];

const banners =
  bannerData?.data || [];

  const cityImages = {
    mumbai:
      "https://res.cloudinary.com/dlwcvgox7/image/upload/v1777802834/posts/yc1rovprg0pu77fp1mes.jpg",
    patna:
      "https://res.cloudinary.com/dlwcvgox7/image/upload/v1777802856/posts/r8y6tme6mcizf6di2xhx.jpg",
  };

  const faq = [
    {
      question: "How can I book event rental services near me?",
      answer:
        "Choose your city, explore services, compare vendors and book directly through KirayNow.",
    },
    {
      question: "Do you provide birthday decoration at home?",
      answer:
        "Yes, vendors provide home decoration services for birthdays, anniversaries and small events.",
    },
    {
      question: "What services are available?",
      answer:
        "Birthday decoration, wedding setup, tent house, furniture rental, sound systems and more.",
    },
    {
      question: "Are vendors verified?",
      answer: "Yes, KirayNow lists trusted and verified vendors.",
    },
    {
      question: "Can I get urgent booking?",
      answer: "Yes, many vendors support same-day or urgent bookings.",
    },
    {
      question: "What is the price range?",
      answer:
        "Prices vary based on service type and customization. You can compare options before booking.",
    },
    {
      question: "Which cities are available?",
      answer:
        "Currently available in Mumbai and Patna, expanding soon.",
    },
    {
      question: "Do you support large events?",
      answer:
        "Yes, from small parties to weddings and corporate events.",
    },
    {
      question: "Is pricing transparent?",
      answer:
        "Yes, you can compare vendors and pricing easily.",
    },
    {
      question: "How do I choose the best vendor?",
      answer:
        "Compare services, pricing, and availability.",
    },
  ];

  return (
    <>
      {/* 🔥 SCHEMA */}
      <Script
        id="schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "KirayNow",
                url: "https://kiraynow.com",
              },
              {
                "@type": "FAQPage",
                mainEntity: faq.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: f.answer,
                  },
                })),
              },
            ],
          }),
        }}
      />

      <div className="mt-16">

        {/* 🔥 HERO (FINAL FIXED) */}
        <HeroCarousel banners={banners} />

        {/* 🔥 SEO INTRO */}

         <div className=" flex mx-auto items-center justify-center text-center px-2 md:max-w-4xl">
              <div className=" md:p-6 px-2 py-6">

                <h1 className="text-xl md:text-4xl font-bold ">
                  Event, Party & Wedding Rentals Across India
                </h1>

                <p className="mt-3 text-sm md:text-base ">
                  Book decoration, furniture, sound systems and more with verified vendors.
                </p>
                 <p className="text-gray-600 leading-relaxed">
            KirayNow helps you find trusted event and party services across India.
            Whether you need birthday decoration at home, wedding setup, tent house services, or furniture rental,
            you can compare vendors, pricing, and book the best option for your event.
          </p>

          <p className="text-sm text-gray-500">
            Popular services: Birthday Decoration • Wedding Setup • Tent House • Chair Rental • Sound System • Lighting Setup
          </p>

                <Link
                  href="/mumbai"
                  className="inline-block mt-4 bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  Explore Services
                </Link>

              </div>
            </div>
      

        {/* 🔥 KEYWORD BOOST (SEO) */}
        <section className="max-w-5xl mx-auto px-4 py-2 md:py-6 text-center">
          
        </section>

        {/* 🔥 CITY CARDS */}
        <section className="max-w-7xl mx-auto px-4 py-4 md:py-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Explore Services by City
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link
                key={city._id}
                href={`/${city.slug}`}
                className="relative h-44 rounded-2xl overflow-hidden group shadow hover:shadow-xl"
              >
                <img
                  src={
                    cityImages[city.slug] ||
                    `https://source.unsplash.com/400x300/?${city.name}`
                  }
                  alt={`${city.name} rental services`}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white text-lg font-semibold">
                    {city.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        

        {/* 🔥 WHY US (UPGRADED) */}
        <section className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Why Choose KirayNow?
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            KirayNow is a trusted rental marketplace connecting users with verified event service providers.
            From birthday decoration at home to wedding setups and furniture rentals, we help you compare options,
            find the best pricing, and book services easily. Our platform simplifies event planning across cities like
            Mumbai and Patna with reliable vendors and fast support.
          </p>
        </section>

         <RelatedBlogs
            title="Wedding & Event Planning Guides"
            subtitle="Explore helpful articles to plan your event smarter."
          />

        {/* 🔥 FAQ */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faq.map((f, i) => (
              <details key={i} className="border p-4 rounded-lg">
                <summary className="font-medium cursor-pointer">
                  {f.question}
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

       

      </div>
    </>
  );
}