import { notFound } from "next/navigation";
import Image from "next/image";
import VendorHero from "@/components/ui/public/VendorHero";
import VendorGallery from "@/components/ui/public/VendorGallery";
import VendorContactCard from "@/components/ui/public/VendorContactCard";
import ProductCard from "@/components/ui/public/ProductCards";
import Servicecards from "@/components/ui/public/Servicecards";
import ServiceCard from "@/components/ui/public/ServiceProductCard";

/* =========================
ISR
========================= */

export const revalidate = 86400;
export const dynamic = "force-static";

/* =========================
FETCH DATA
========================= */

async function getVendorData(vendorSlug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/business/${vendorSlug}`,
    {
      next: { revalidate: 86400 },
      cache: "force-cache",
    },
  );

  if (!res.ok) return null;

  return res.json();
}

/* =========================
SEO METADATA
========================= */

export async function generateMetadata({ params }) {
  const { slug, vendorSlug } = await params;

  const data = await getVendorData(vendorSlug);
  if (!data) return {};

  const vendor = data.data;

  const baseUrl = "https://kiraynow.com";

  const title = `${vendor.name} in ${slug} | Event Rental Vendor`;

  const description =
    vendor.description?.replace(/<[^>]+>/g, "").slice(0, 160) ||
    `Book rental services from ${vendor.name} in ${slug}. Verified vendor for event rental equipment.`;

  const image =
    vendor.coverImage ||
    vendor.logo ||
    vendor.gallery?.[0] ||
    "https://res.cloudinary.com/dlwcvgox7/image/upload/v1770999576/posts/iwaqbv8dufoyz8hqjuyq.webp";

  const url = `${baseUrl}/${slug}/vendors/${vendorSlug}`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false
      }
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
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
PAGE
========================= */

export default async function VendorPage({ params }) {
  const { slug, vendorSlug } = await params;

  const data = await getVendorData(vendorSlug);

  if (!data) return notFound();

  const vendor = data.data;

  const products = vendor.products || [];
  const services = vendor.services || [];

  const galleryImages = [
    vendor.coverImage,
    vendor.logo,
    ...(vendor.gallery || []),
  ].filter(Boolean);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ================= HERO ================= */}

      <VendorHero vendor={vendor} />

      {/* ================= CONTENT ================= */}

      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-12 gap-12">
        {/* LEFT SIDE */}

        <div className="lg:col-span-8 space-y-10">
          {/* ABOUT */}

          {vendor.description && (
            <section>
              <h2 className="text-xl font-semibold mb-4">
                About {vendor.name}
              </h2>

              <div
                className="text-gray-700 leading-relaxed prose max-w-none content"
                dangerouslySetInnerHTML={{ __html: vendor.description }}
              />
            </section>
          )}

          {/* GALLERY */}

          {galleryImages.length > 0 && (
            <VendorGallery images={galleryImages} vendor={vendor} />
          )}

          {/* PRODUCTS */}

          {products.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-6">Rental Products</h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => {
                  const productWithVendorPrice = {
                    ...p.product,
                    pricing: {
                      ...p.product.pricing,
                      minPrice: p.price || p.product.pricing?.minPrice,
                      discountedPrice:
                        p.discountedPrice || p.product.pricing?.discountedPrice,
                    },
                  };

                  return (
                    <ProductCard
                      key={p.product._id}
                      product={productWithVendorPrice}
                      citySlug={slug}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* SERVICES */}

         {services.length > 0 && (
  <section>
    <h2 className="text-xl font-semibold mb-6">Services Offered</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 md:gap-6">
      {services.map((s) => {

        const serviceWithVendorPrice = {
          ...s.service,
          pricing: {
            type: "fixed",
            amount: s.price
          }
        };

        return (
          <ServiceCard
            key={s.service._id}
            service={serviceWithVendorPrice}
            citySlug={slug}
          />
        );
      })}
    </div>
  </section>
)}
        </div>

        {/* RIGHT SIDE */}

        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <VendorContactCard vendor={vendor} />
          </div>
        </div>
      </div>
    </div>
  );
}
