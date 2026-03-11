import ProductCard from "@/components/ui/public/ProductCards";
import { apiRequest } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {

  const params = await searchParams || {};

  const q = params?.q?.trim() || "";
  const city = params?.city?.trim() || "";
  const page = Number(params?.page) || 1;

  if (!q) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        Please enter a search term.
      </div>
    );
  }

  let products = [];
  let error = null;

  try {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products?q=${encodeURIComponent(q)}${
      city ? `&city=${encodeURIComponent(city)}` : ""
    }&page=${page}`;

    const res = await apiRequest(url);

    if (res && Array.isArray(res.data)) {
      products = res.data;
    } else {
      products = [];
    }

  } catch (err) {
    console.error("Search API error:", err);
    error = "Something went wrong while fetching products.";
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 mt-16">

      <h1 className="text-2xl font-semibold mb-6">
        Search Results for "{q}"
      </h1>

      {error && (
        <div className="text-red-500 py-6">
          {error}
        </div>
      )}

      {!error && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              citySlug={city}
            />
          ))}
        </div>
      ) : !error ? (
        <div className="text-gray-500 py-10">
          No products found.
        </div>
      ) : null}

    </div>
  );
}