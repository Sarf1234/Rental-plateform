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
  const baseUrl = "https://kiraynow.com";

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

  const cleanDescription = product.description
    ?.replace(/<[^>]+>/g, "")
    .slice(0, 160);

  const title = product.seo?.metaTitle
    ? `${product.seo.metaTitle} in ${cityName}`
    : `${product.title} in ${cityName}`;

  const description = product.seo?.metaDescription
    ? `${product.seo.metaDescription} Available in ${cityName}.`
    : cleanDescription
    ? `${cleanDescription} Available for rent in ${cityName}.`
    : `Rent ${product.title} in ${cityName} at affordable pricing. ${
        primaryPrice ? `Starting from ₹${primaryPrice}.` : ""
      }`;

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kiraynow.com";

  const cityName = data?.city?.name || slug;
  const productUrl = `${baseUrl}/${slug}/products/${productSlug}`;

  const primaryPrice =
    pricing?.discountedPrice || pricing?.minPrice || pricing?.amount || 1000;

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
        { "@type": "ListItem", position: 2, name: cityName, item: `${baseUrl}/${slug}` },
        { "@type": "ListItem", position: 3, name: "Rental Products", item: `${baseUrl}/${slug}/products` },
        { "@type": "ListItem", position: 4, name: title, item: productUrl },
      ],
    },

    {
      "@type": "Product",
      "@id": productUrl,
      name: `${title} in ${cityName}`,
      image: images,
      description: description?.replace(/<[^>]+>/g, "").slice(0, 250),
      brand: {
        "@type": "Brand",
        name: "KirayNow",
      },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "INR",
        price: primaryPrice,
        availability: "https://schema.org/InStock",
      },
    },

    ...(faqs?.length
      ? [{
          "@type": "FAQPage",
          mainEntity: faqs.slice(0, 5).map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }]
      : []),
  ],
};


  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20">
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
    </div>
  );
}
