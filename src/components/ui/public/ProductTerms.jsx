export default function ProductTerms({ terms }) {
  if (!terms) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-6">
        Terms & Conditions
      </h2>

      <div
        className="prose max-w-none content text-sm text-gray-600"
        dangerouslySetInnerHTML={{ __html: terms }}
      />
    </div>
  );
}
