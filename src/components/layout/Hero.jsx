import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">

      {/* subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_55%)]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-14">

        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">

          {/* PRIMARY H1 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            Find clarity in AI —{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              tools, tutorials & practical tips
            </span>{" "}
            that make AI useful for everyone
          </h1>

          {/* SHORT SUBTITLE (mobile-first) */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 mb-6">
            Practical, easy-to-follow AI guides, tool walkthroughs, and explainers — for beginners and busy people.
            Learn how AI can simplify tasks, boost productivity, and keep you safe online — no coding required.
          </p>

          {/* LONG PARAGRAPH (desktop only) */}
          <p className="hidden lg:block text-slate-500 max-w-2xl mb-8">
            From step-by-step tutorials and tool reviews to news and practical automation ideas — IndiaAIMag shows
            how AI works in everyday life. We test the latest tools, explain what’s safe, and give hands-on examples
            so anyone can use AI to save time and make smarter decisions.
          </p>

          {/* CTA GROUP */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

            {/* Primary */}
            <Link
              href="/blog"
              className="px-7 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition text-center"
            >
              Explore AI Guides
            </Link>

            {/* Secondary */}
            <Link
              href="/tools"
              className="px-7 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition text-center"
            >
              Try AI Tools →
            </Link>
          </div>

          {/* Micro CTA */}
          <div className="mt-4">
            <Link
              href="/news"
              className="text-sm text-blue-600 hover:text-blue-700 transition font-medium"
            >
              Latest AI News →
            </Link>
          </div>

          {/* Trust Line */}
          <div className="mt-8 text-sm text-slate-500">
            Trusted by readers who want simple AI help —{" "}
            <span className="font-medium text-slate-700">
              practical, tested, and privacy-minded
            </span>.
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <Image
            src="https://res.cloudinary.com/dsc5aznps/image/upload/v1765379173/posts/jdtfk1pn0jxldibef1zf.png"
            alt="AI tools and everyday automation for people — approachable AI guide"
            width={560}
            height={560}
            priority
            className="select-none drop-shadow-lg"
          />
        </div>

      </div>
    </section>
  );
}
