export default function ProductFAQ({ faqs, cityData }) {
  if (!faqs?.length) return null;


  const cityName = cityData?.name;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-6">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.slice(0, 6).map((faq, i) => {

          // 🔥 Inject city into question smartly
          let question = faq.question;

          if (cityName && !question.toLowerCase().includes(cityName.toLowerCase())) {
            if (question.toLowerCase().includes("price")) {
              question = `What is the price of ${question
                .replace("What is the price of ", "")
                .replace("?", "")} in ${cityName}?`;
            }
          }

          return (
            <details key={i} className="border rounded-xl p-5">
              <summary className="font-semibold cursor-pointer">
                {question}
              </summary>
              <p className="text-gray-600 mt-2">
                {faq.answer}
                
              </p>
            </details>
          );
        })}
      </div>
    </div>
  );
}