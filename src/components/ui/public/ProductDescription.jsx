export default function ProductDescription({ description }) {
  if (!description) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-6">
        Product Details
      </h2>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
