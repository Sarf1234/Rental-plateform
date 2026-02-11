import ProductGallery from "@/components/ui/public/ProductGallery";
import ProductDescription from "@/components/ui/public/ProductDescription";
import ProductFAQ from "@/components/ui/public/ProductFAQ";
import ProductTerms from "@/components/ui/public/ProductTerms";
import ProductInfo from "@/components/ui/public/ProductInfo";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/* =========================
   SEO METADATA
========================= */
export async function generateMetadata({ params }) {
  const { slug, productSlug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productSlug}?city=${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return {};

  const data = await res.json();
  const product = data?.data;
  const city = data?.city;

  if (!product) return {};

  const cityName = city?.name || slug;

  return {
    title:
      product.seo?.metaTitle
        ? `${product.seo.metaTitle} in ${cityName}`
        : `${product.title} in ${cityName}`,

    description:
      product.seo?.metaDescription
        ? `${product.seo.metaDescription} Available in ${cityName}.`
        : `Rent ${product.title} in ${cityName} at affordable pricing.`,

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/city/${slug}/products/${productSlug}`,
    },
  };
}


/* =========================
   PRODUCT PAGE
========================= */
export default async function ProductPage({ params }) {
  const { slug, productSlug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productSlug}?city=${slug}`,
    { cache: "no-store" },
  );

  if (!res.ok) return notFound();

  const data = await res.json();
  const product = data?.data;


  if (!product) return notFound();

  const {
    title,
    images,
    description,
    pricing,
    highlights,
    faqs,
    termsAndConditions,
  } = product;


  const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";

const cityName = data?.city?.name || slug;
const productUrl = `${baseUrl}/city/${slug}/products/${productSlug}`;

const primaryPrice =
  pricing?.discountedPrice ||
  pricing?.minPrice ||
  pricing?.amount ||
  1000;

// Optional seller logic (if provider exists in backend later)
const seller = {
  "@type": "LocalBusiness",
  name: "Verified Rental Provider",
  address: {
    "@type": "PostalAddress",
    addressLocality: cityName,
    addressCountry: "IN",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [

    // 🔹 Platform Organization
    {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: "YourBrandName",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-8839931558",
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    },

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
          name: cityName,
          item: `${baseUrl}/city/${slug}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Rental Products",
          item: `${baseUrl}/city/${slug}/products`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: title,
          item: productUrl,
        },
      ],
    },

    // 🔹 Product
    {
      "@type": "Product",
      "@id": productUrl,
      name: `${title} in ${cityName}`,
      image: images?.[0],
      description:
        product.seo?.metaDescription ||
        description?.replace(/<[^>]+>/g, "").slice(0, 250),
      brand: {
        "@type": "Brand",
        name: "YourBrandName",
      },

      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.5", // dummy for now
        reviewCount: "74",  // dummy for now
      },

      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "INR",
        price: primaryPrice,
        availability: "https://schema.org/InStock",
        seller: seller,
      },
    },

    // 🔹 FAQ Schema
    {
      "@type": "FAQPage",
      mainEntity: (faqs || []).slice(0, 5).map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};


  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-20 bg-gray-50">
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      <div className="grid lg:grid-cols-12 gap-12">
        {/* LEFT SIDE */}
        <div className="lg:col-span-7">
          <ProductGallery images={images} title={title} />
          <div className="block md:hidden">
            <ProductInfo
              title={title}
              pricing={pricing}
              highlights={highlights}
              productdescription={product.seo.metaDescription}
              citySlug={slug}
            />
          </div>
          <ProductDescription
            description={description}
            title={title}
            cityData={data?.city}
            pricing={pricing}
          />
          <ProductFAQ faqs={faqs} />
          <ProductTerms terms={termsAndConditions} />
        </div>

        {/* RIGHT SIDE (STICKY CARD) */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 md:block hidden">
            <ProductInfo
              title={title}
              pricing={pricing}
              highlights={highlights}
              productdescription={product.seo.metaDescription}
              citySlug={slug}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
