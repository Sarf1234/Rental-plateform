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
  const { citySlug, productSlug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productSlug}`,
    { cache: "no-store" },
  );

  if (!res.ok) return {};

  const data = await res.json();
  const product = data?.data;

  if (!product) return {};

  return {
    title: product.seo?.metaTitle || product.title,
    description: product.seo?.metaDescription || "",
  };
}

/* =========================
   PRODUCT PAGE
========================= */
export default async function ProductPage({ params }) {
  const { slug, productSlug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productSlug}`,
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

  return (
    <div className="max-w-7xl mx-auto px-4 mt-24 pb-20">
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
          <ProductDescription description={description} />
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
