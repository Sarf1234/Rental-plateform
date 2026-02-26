export default function ProductFAQ({ faqs }) {
  if (!faqs?.length) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-6">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="border rounded-xl p-5">
            <summary className="font-semibold cursor-pointer">
              {faq.question}
            </summary>
            <p className="text-gray-600 mt-2">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
