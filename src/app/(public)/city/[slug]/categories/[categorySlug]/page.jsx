import ProductCards from "@/components/ui/public/ProductCards";
import { apiRequest } from "@/lib/api";

export const dynamic = "force-dynamic";

/* ===========================
   Dynamic SEO Metadata
=========================== */
export async function generateMetadata({ params }) {
  const { slug, categorySlug } = await params;

  const cityName = slug.replace("-", " ");
  const categoryName = categorySlug.replace("-", " ");

  return {
    title: `${categoryName} Rental in ${cityName} | kiraynow`,
    description: `Book ${categoryName} rental services in ${cityName}. Affordable pricing, fast delivery and professional setup.`,
  };
}

/* ===========================
   CATEGORY PAGE
=========================== */
export default async function CategoryPage({ params, searchParams }) {

  const { slug, categorySlug } = await params;
  

  let products = [];
  let pagination = {};
  

  try {
    const res = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?city=${slug}&category=${categorySlug}&page=1&limit=12`
    );

    products = res?.data || [];
    pagination = res?.pagination || {};
  } catch (err) {
    console.error("Category Page Error:", err);
  }

  const cityName = slug.replace("-", " ");
  const categoryName = categorySlug.replace("-", " ");

  return (
    <div className="min-h-screen mt-16 max-w-7xl mx-auto px-4 py-10">

      {/* PAGE HEADING */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold capitalize">
          {categoryName} Rental in {cityName}
        </h1>
        <p className="text-gray-600 mt-2">
          Browse premium {categoryName} rental products available in {cityName}.
        </p>
      </div>

      {/* PRODUCTS GRID */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCards
              key={product._id}
              product={product}
              citySlug={slug}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 py-20 text-center">
          No products found in this category.
        </div>
      )}

    </div>
  );
}
