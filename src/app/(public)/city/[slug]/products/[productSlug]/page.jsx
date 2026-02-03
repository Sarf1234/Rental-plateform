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
    { cache: "no-store" }
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
  const { citySlug, productSlug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productSlug}`,
    { cache: "no-store" }
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

      {/* TOP SECTION */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE GALLERY */}
        <div className="space-y-4">
          <div className="relative h-[420px] rounded-2xl overflow-hidden border">
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {images?.slice(1).map((img, i) => (
              <div key={i} className="relative h-24 rounded-xl overflow-hidden border">
                <Image
                  src={img}
                  alt="thumb"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            {title}
          </h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {highlights?.isFeatured && (
              <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                Featured
              </span>
            )}
            {highlights?.isTopRented && (
              <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                Top Rented
              </span>
            )}
            {highlights?.isBestDeal && (
              <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                Best Deal
              </span>
            )}
          </div>

          {/* Pricing Card */}
          <div className="mt-8 p-6 border rounded-2xl bg-gray-50">
            <p className="text-sm text-gray-500">Starting From</p>
            <p className="text-3xl font-bold text-black">
              ₹{pricing?.discountedPrice || pricing?.minPrice}
            </p>
            <p className="text-sm text-gray-500">
              per {pricing?.unit}
            </p>

            <button className="mt-6 w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
              Rent Now
            </button>
          </div>

        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">
          Product Details
        </h2>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      {/* FAQ */}
      {faqs?.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border rounded-xl p-5">
                <h3 className="font-semibold">
                  {faq.question}
                </h3>
                <p className="text-gray-600 mt-2">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TERMS */}
      {termsAndConditions && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">
            Terms & Conditions
          </h2>

          <div
            className="prose max-w-none text-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: termsAndConditions }}
          />
        </div>
      )}

    </div>
  );
}
