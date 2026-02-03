import ProductCard from "@/components/ui/public/ProductCards";
import { apiRequest } from "@/lib/api";

export const dynamic = "force-dynamic"; // important

export default async function SearchPage({ searchParams }) {

  const params = await searchParams;

  const q = params.q || "";
  const city = params.city || "";
  const page = params.page || 1;

  if (!q) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        Please enter a search term.
      </div>
    );
  }

  const res = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?q=${q}${city ? `&city=${city}` : ""}&page=${page}`
  );

  const products = res?.data || [];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">

      <h1 className="text-2xl font-semibold mb-6">
        Search Results for "{q}"
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              citySlug={city}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 py-10">
          No products found.
        </div>
      )}

    </div>
  );
}
