import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">

      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-14">

        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">

          {/* SEO OPTIMIZED H1 */}
          <h1 className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              IndiaAIMag
            </span>{" "}
            – Practical AI tools, guides & news for everyday Indians
          </h1>

          {/* SUBTITLE */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 mb-6">
            AI ko simple language me samjho aur real life me use karo — productivity,
            online safety, business, jobs aur daily tasks ke liye. Beginner-friendly
            Hinglish explainers, bina coding ke.
          </p>

          {/* DESKTOP PARAGRAPH */}
          <p className="hidden lg:block text-slate-500 max-w-2xl mb-8">
            IndiaAIMag beginners, students, creators aur small businesses ke liye
            AI ko easy banata hai. Yahan aapko milte hain tested AI tools,
            step-by-step guides, safety explainers aur latest AI news — specially
            Indian users ko dhyan me rakh kar.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

            <Link
              href="/blog"
              className="px-7 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition text-center"
            >
              Read AI Guides for Beginners
            </Link>

            <Link
              href="/tools"
              className="px-7 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition text-center"
            >
              Explore AI Tools →
            </Link>
          </div>

          {/* MICRO CTA */}
          <div className="mt-4">
            <Link
              href="/news"
              className="text-sm text-blue-600 hover:text-blue-700 transition font-medium"
            >
              Latest AI News in India →
            </Link>
          </div>

          {/* TRUST LINE */}
          <div className="mt-8 text-sm text-slate-500">
            Trusted by readers who want simple AI help —{" "}
            <span className="font-medium text-slate-700">
              practical, tested, and privacy-focused
            </span>.
          </div>
        </div>

        {/* RIGHT IMAGE (BACKGROUND FIXED) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative">
            <Image
              src="https://res.cloudinary.com/dsc5aznps/image/upload/v1767978281/posts/oj6g7sssvblwxi5hizj6.png"
              alt="IndiaAIMag AI tools and guides for beginners in India"
              width={560}
              height={560}
              priority
              className="select-none mix-blend-multiply"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
