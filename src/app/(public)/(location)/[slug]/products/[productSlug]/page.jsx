import ProductGallery from "@/components/ui/public/ProductGallery";
import ProductDescription from "@/components/ui/public/ProductDescription";
import ProductFAQ from "@/components/ui/public/ProductFAQ";
import ProductTerms from "@/components/ui/public/ProductTerms";
import ProductInfo from "@/components/ui/public/ProductInfo";
import Image from "next/image";
import { notFound } from "next/navigation";
import FlagsCards from "@/components/ui/public/FlagsCards";
import Servicecards from "@/components/ui/public/Servicecards";
import ProviderCards from "@/components/ui/public/ProviderCards";
import { Suspense } from "react";

export const revalidate = 3600;
export const dynamic = "force-static";

async function getProductData(slug, productSlug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productSlug}?city=${slug}`,
    {
      next: { revalidate: 3600 },
      cache: "force-cache",
    }
  );

  if (!res.ok) return null;

  return res.json();
}

/* =========================
   SEO METADATA
========================= */
export async function generateMetadata({ params }) {
  const { slug, productSlug } = await params;
  const baseUrl = "https://kiraynow.com";

  const data = await getProductData(slug, productSlug);
  if (!data) return {};
  const product = data?.data;
  const city = data?.city;
  const locationContext = data?.locationContext;
  if (!product) return {};

  const cityName = city?.name || slug;

  const primaryPrice =
    product?.pricing?.discountedPrice ||
    product?.pricing?.minPrice ||
    product?.pricing?.amount ||
    null;

  function replaceTokens(template) {
    if (!template) return "";

    let result = template;

    // city replace
    result = result.replace(/\{city\}/gi, cityName);

    // price replace
    if (primaryPrice) {
      result = result.replace(/\{price\}/gi, `₹${primaryPrice}`);
    } else {
      result = result.replace(/₹?\s?\{price\}/gi, "");
    }

    // cleanup
    result = result
      .replace(/\s+/g, " ")
      .replace(/\s-\s$/, "")
      .replace(/\s\|\s$/, "")
      .trim();

    return result;
  }

  const cleanDescription = product.description
    ?.replace(/<[^>]+>/g, "")
    .slice(0, 160);

  // TITLE
  const title = locationContext?.seoTitleOverride
    ? replaceTokens(locationContext.seoTitleOverride)
    : product.seo?.metaTitle
      ? replaceTokens(product.seo.metaTitle)
      : `${product.title} in ${cityName}`;

  // DESCRIPTION
  const description = locationContext?.seoDescriptionOverride
    ? replaceTokens(locationContext.seoDescriptionOverride)
    : product.seo?.metaDescription
      ? replaceTokens(product.seo.metaDescription)
      : cleanDescription
        ? `${cleanDescription} Available for rent in ${cityName}.`
        : `Rent ${product.title} in ${cityName}.`;

  const image =
    product.images?.[0] ||
    "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp";

  const url = `${baseUrl}/${slug}/products/${productSlug}`;

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
      type: "website",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* =========================
   PRODUCT PAGE
========================= */
export default async function ProductPage({ params }) {
  const { slug, productSlug } = await params;

  const data = await getProductData(slug, productSlug);
  if (!data) return {};
  const product = data?.data;
  const locationContext = data?.locationContext;
  const relatedProducts = data?.relatedProducts || [];
  const relatedServices = data?.relatedServices || [];
  const suggestedProducts = product?.suggestedProducts || [];
  const suggestedServices = product?.suggestedServices || [];
  const city = data?.city;
  const providers = data?.providers || [];
  const vendors = data?.vendors || [];
  const productRating = data?.productRating || 0;
  const productReviewCount = data?.productReviewCount || 0;

  if (!product) return notFound();

  const {
    title,
    images,
    description,
    pricing,
    highlights,
    faqs: rawFaqs,
    termsAndConditions,
  } = product;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kiraynow.com";

  const cityName = data?.city?.name || slug;
  const productUrl = `${baseUrl}/${slug}/products/${productSlug}`;

  /* =========================
   MERGE FAQ (LOCATION + PRODUCT)
========================= */

const locationFaqs = locationContext?.faq || [];
const productFaqs = rawFaqs || [];

// 🔥 Step 1: Process product FAQs (existing logic)
const processedProductFaqs = productFaqs.map((faq) => {
  let question = faq.question;
  let answer = faq.answer;

  if (cityName) {
    // replace {city}
    question = question.replace(/\{city\}/gi, cityName);
    answer = answer.replace(/\{city\}/gi, cityName);

    // smart pricing injection
    const pricingKeywords = ["price", "rent", "rental", "cost", "how much"];
    const lowerQ = question.toLowerCase();

    const shouldInject =
      pricingKeywords.some((k) => lowerQ.includes(k)) &&
      !lowerQ.includes(cityName.toLowerCase());

    if (shouldInject) {
      if (question.includes("?")) {
        question = question.replace("?", ` in ${cityName}?`);
      } else {
        question = `${question} in ${cityName}`;
      }
    }
  }

  return { question, answer };
});

// 🔥 Step 2: Process location FAQs (NEW)
const processedLocationFaqs = locationFaqs.map((faq) => {
  let question = faq.question;
  let answer = faq.answer;

  if (cityName) {
    question = question.replace(/\{city\}/gi, cityName);
    answer = answer.replace(/\{city\}/gi, cityName);
  }

  return { question, answer };
});

// 🔥 Step 3: Merge (LOCATION FIRST 🚀)
const faqs = [
  ...processedLocationFaqs,
  ...processedProductFaqs,
].slice(0, 10); // limit for SEO

  function replaceDynamicTokens(text, cityName, price) {
    if (!text) return text;

    let result = text;

    // replace {city}
    result = result.replace(/\{city\}/gi, cityName);

    // replace hardcoded Patna (future proof)
    result = result.replace(/\bpatna\b/gi, cityName);

    // replace {price}
    if (price) {
      result = result.replace(/\{price\}/gi, `₹${price}`);
    } else {
      result = result.replace(/₹?\s?\{price\}/gi, "");
    }

    return result;
  }

  const primaryPrice =
   pricing?.discountedPrice || pricing?.minPrice ||  pricing?.amount || 1000;

  const processedDescription = replaceDynamicTokens(
    description,
    cityName,
    primaryPrice,
  );

  const processedTerms = replaceDynamicTokens(
    termsAndConditions,
    cityName,
    primaryPrice,
  );

  // Optional seller logic (if provider exists in backend later)
  const seller =
    providers.length > 0
      ? {
          "@type": "LocalBusiness",
          name: providers[0].name,
          telephone: providers[0].phone,
          address: {
            "@type": "PostalAddress",
            addressLocality: cityName,
            addressCountry: "IN",
          },
        }
      : {
          "@type": "LocalBusiness",
          name: `Rental Provider in ${cityName}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: cityName,
            addressCountry: "IN",
          },
        };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: "KirayNow",
        url: baseUrl,
        logo: "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp",
      },

      {
        "@type": "BreadcrumbList",
        "@id": `${productUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: cityName,
            item: `${baseUrl}/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Rental Products",
            item: `${baseUrl}/${slug}/products`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: title,
            item: productUrl,
          },
        ],
      },

      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: `${title} in ${cityName}`,
        image: images,
        description: locationContext?.customIntro ||  processedDescription
          ?.replace(/<[^>]+>/g, "")
          .slice(0, 500),

        brand: {
            "@type": "Organization",
            name: "KirayNow",
            url: baseUrl
          },

        seller,

        areaServed: {
          "@type": "City",
          name: cityName,
        },

        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "INR",
          price: primaryPrice,
          availability: "https://schema.org/InStock",
          priceValidUntil: "2026-12-31",
        },

        ...(productReviewCount > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: productRating,
            reviewCount: productReviewCount,
          },
        }),
      },

      ...(faqs?.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${productUrl}#faq`,
              mainEntity: faqs.slice(0, 8).map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 mt-16">
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
            <div className="mt-3 text-sm text-gray-600"></div>
            <div className="block md:hidden">
              <ProductInfo
                title={title}
                pricing={pricing}
                highlights={highlights}
                productdescription={product.seo.metaDescription}
                citySlug={slug}
                productSlug={productSlug}
                locationContext={locationContext}
                productRating={data?.productRating}
                productReviewCount={data?.productReviewCount}
                isMainHeading={true}
              />
            </div>
            {vendors.length > 0 && <ProviderCards data={vendors} citySlug={slug} productName={title} />}
            <ProductDescription
              description={processedDescription}
              title={title}
              cityData={data?.city}
              pricing={pricing}
              locationContext={locationContext}
            />
            <ProductFAQ faqs={faqs} cityData={data?.city} />
            <ProductTerms terms={processedTerms} />
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
                productSlug={productSlug}
                locationContext={locationContext}
                productRating={data?.productRating}
                productReviewCount={data?.productReviewCount}
                isMainHeading={false}
              />
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="h-40" />}>
        {suggestedProducts.length > 0 ? (
          <FlagsCards
            data={suggestedProducts}
            citySlug={slug}
            title={`Related Rental Products in ${city?.name}`}
          />
        ) : relatedProducts.length > 0 ? (
          <FlagsCards
            data={relatedProducts}
            citySlug={slug}
            title={`Related Rental Products in ${city?.name}`}
          />
        ) : null}

        {suggestedServices.length > 0 ? (
          <Servicecards
            data={suggestedServices}
            citySlug={slug}
            title={`Services That Use This Product in ${city?.name}`}
            subtitle={`Top-rated services in ${city?.name} that use this product`}
          />
        ) : relatedServices.length > 0 ? (
          <Servicecards
            data={relatedServices}
            citySlug={slug}
            title={`Services That Use This Product in ${city?.name}`}
            subtitle={`Top-rated services in ${city?.name} that use this product`}
          />
        ) : null}

      </Suspense>
    </div>
  );
}
