import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import RelatedBlogs from "@/components/layout/RelatedBlogs";
import HeroCarousel from "@/components/layout/HeroCrousel";
import { apiRequest } from "@/lib/api";

export const revalidate = 604800; // 7 days SSG
export const dynamic = "force-static";

export const metadata = {
  title: "Event & Party Rentals Across India | KirayNow",
  description:
    "Book birthday decoration, wedding setup, tent house, furniture and event rental services across India with verified vendors.",
};
export default async function HomePage() {
  let cities = [];
  let banners = [];

  try {
    const [cityRes, bannerRes] = await Promise.all([
      apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cities?page=1&limit=100`,
      ),

      apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/banners?placement=homepage`,
      ),
    ]);

    cities = cityRes?.data || [];

    banners = bannerRes?.data || [];
  } catch (err) {
    console.error("Homepage fetch failed:", err);
  }

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
      answer: "Currently available in Mumbai and Patna, expanding soon.",
    },
    {
      question: "Do you support large events?",
      answer: "Yes, from small parties to weddings and corporate events.",
    },
    {
      question: "Is pricing transparent?",
      answer: "Yes, you can compare vendors and pricing easily.",
    },
    {
      question: "How do I choose the best vendor?",
      answer: "Compare services, pricing, and availability.",
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

      <div className="mt-0">
  {/* 🔥 HERO */}
  <section className="max-w-7xl mx-auto md:px-4 mt-0 md:mt-20"></section>

  <HeroCarousel banners={banners} />

  {/* 🔥 SEO INTRO */}
  <section className="max-w-4xl mx-auto px-3 sm:px-4 py-6 md:py-10">
    <div className="text-center">
      <h1
        className="
          text-xl
          sm:text-2xl
          md:text-4xl

          font-bold
          leading-[1.2]
          tracking-tight

          text-gray-900
        "
      >
        Event, Party & Wedding Rentals Across India
      </h1>

      <p
        className="
          mt-2
          md:mt-3

          text-sm
          md:text-base

          leading-6
          text-gray-900
        "
      >
        Book decoration, furniture, sound systems and more with verified
        vendors.
      </p>

      <p
        className="
          mt-2
          md:mt-3

          text-sm
          md:text-base

          leading-6
          md:leading-relaxed

          text-gray-600
        "
      >
        KirayNow helps you find trusted event and party services across
        India. Whether you need birthday decoration at home, wedding
        setup, tent house services, or furniture rental, you can compare
        vendors, pricing, and book the best option for your event.
      </p>

      <p
        className="
          mt-2
          md:mt-3

          text-xs
          sm:text-sm

          leading-5

          text-gray-500
        "
      >
        Popular services: Birthday Decoration • Wedding Setup • Tent House
        • Chair Rental • Sound System • Lighting Setup
      </p>

      <Link
        href="/mumbai"
        className="
          inline-flex
          items-center
          justify-center

          mt-4

          rounded-lg

          bg-yellow-500
          hover:bg-yellow-400

          px-5
          sm:px-6

          py-2

          text-sm
          sm:text-base

          font-semibold
          text-black

          transition

          active:scale-[0.98]
        "
      >
        Explore Services
      </Link>
    </div>
  </section>

  {/* 🔥 KEYWORD BOOST (SEO) */}
  <section className="max-w-5xl mx-auto px-4 py-1 md:py-4 text-center"></section>

  {/* 🔥 CITY CARDS */}
  <section
    className="
      max-w-7xl
      mx-auto
      px-4

      py-7
      md:py-16
    "
  >
    <h2
      className="
        text-xl
        sm:text-2xl

        font-semibold
        leading-[1.25]

        mb-5
        md:mb-8

        text-center
        text-gray-900
      "
    >
      Explore Services by City
    </h2>

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3

        gap-3
        sm:gap-4
        md:gap-6
      "
    >
      {cities.map((city) => (
        <Link
          key={city._id}
          href={`/${city.slug}`}
          className="
            relative

            h-36
            sm:h-40
            md:h-44

            rounded-xl
            md:rounded-2xl

            overflow-hidden

            group

            shadow-sm
            hover:shadow-xl

            transition-shadow
            duration-300
          "
        >
          <img
            src={
              cityImages[city.slug] ||
              `https://source.unsplash.com/400x300/?${city.name}`
            }
            alt={`${city.name} rental services`}
            className="
              w-full
              h-full

              object-cover

              group-hover:scale-105

              transition-transform
              duration-500
            "
          />

          <div
            className="
              absolute
              inset-0

              bg-gradient-to-t
              from-black/70
              via-black/20
              to-transparent

              flex
              items-end

              p-3
              sm:p-4
            "
          >
            <h3
              className="
                text-white

                text-base
                md:text-lg

                font-semibold

                leading-[1.3]
              "
            >
              {city.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  </section>

  {/* 🔥 WHY US */}
  <section
    className="
      max-w-7xl
      mx-auto
      px-4

      py-10
      md:py-16

      text-center
    "
  >
    <h2
      className="
        text-xl
        sm:text-2xl

        font-semibold
        leading-[1.25]

        mb-4
        md:mb-6

        text-gray-900
      "
    >
      Why Choose KirayNow?
    </h2>

    <p
      className="
        max-w-3xl
        mx-auto

        text-sm
        md:text-base

        leading-6
        md:leading-relaxed

        text-gray-600
      "
    >
      KirayNow is a trusted rental marketplace connecting users with
      verified event service providers. From birthday decoration at home
      to wedding setups and furniture rentals, we help you compare
      options, find the best pricing, and book services easily. Our
      platform simplifies event planning across cities like Mumbai and
      Patna with reliable vendors and fast support.
    </p>
  </section>

  <RelatedBlogs
    title="Wedding & Event Planning Guides"
    subtitle="Explore helpful articles to plan your event smarter."
  />

  {/* 🔥 FAQ */}
  <section
    className="
      max-w-7xl
      mx-auto
      px-4

      py-8
      md:py-12
    "
  >
    <h2
      className="
        text-xl
        md:text-2xl

        font-semibold

        mb-5
        md:mb-6

        text-gray-900
      "
    >
      Frequently Asked Questions
    </h2>

    <div className="space-y-2.5 sm:space-y-4">
      {faq.map((f, i) => (
        <details
          key={i}
          className="
            border
            border-gray-200

            bg-white

            p-3
            sm:p-4

            rounded-xl
            sm:rounded-lg
          "
        >
          <summary
            className="
              font-medium
              cursor-pointer

              text-sm
              md:text-base

              leading-5
              md:leading-6

              text-gray-900
            "
          >
            {f.question}
          </summary>

          <p
            className="
              mt-2

              text-xs
              sm:text-sm

              leading-5
              sm:leading-6

              text-gray-600
            "
          >
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
