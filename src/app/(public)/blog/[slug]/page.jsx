import Image from "next/image";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import {
  generateBlogSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/utils/blogSchema";

import BlogRelatedProducts from "@/components/ui/public/BlogRelatedProducts";
import BlogRelatedServices from "@/components/ui/public/BlogRelatedServices";

export const revalidate = 600;

async function getPost(slug) {
  return await apiRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${slug}`,
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const res = await getPost(slug);
  const post = res.data;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      images: [post.coverImage],
    },
  };
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const res = await getPost(slug);
  const post = res.data;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kiraynow.com";

  const blogSchema = generateBlogSchema(post, baseUrl);
  const faqSchema = generateFAQSchema(post.faqs);
  const breadcrumbSchema = generateBreadcrumbSchema(post, baseUrl);

  const whatsappMessage = encodeURIComponent(`
Hi KirayNow 👋

I read your blog: "${post.title}"

I want help planning my event. Please share details.
  `);

  return (
    <>
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#f5f7fa] min-h-screen mt-16">
        {/* HERO */}
        <section className="relative h-[60vh] w-full">
          <Image
            src={post.coverImage || "/placeholder.png"}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <div className="max-w-3xl">
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {post.title}
              </h1>
              <p className="text-white/80 mt-4 text-sm">
                {new Date(post.createdAt).toLocaleDateString()} •{" "}
                {post.readTime || 3} min read
              </p>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-12">
            {/* Article */}
            <article className="bg-white rounded-xl shadow-sm p-6 md:p-10">
              <div
                className="prose prose-lg content max-w-none prose-headings:font-semibold prose-p:text-gray-700 prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* FAQ */}
            {post.faqs?.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-8 text-gray-900">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-5">
                  {post.faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 group"
                    >
                      <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
                        {faq.question}
                        <span className="group-open:rotate-180 transition">
                          ▼
                        </span>
                      </summary>
                      <p className="mt-3 text-sm text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Related Services */}
            {post.relatedServices?.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Related Services
                </h2>
                <BlogRelatedServices services={post.relatedServices} />
              </section>
            )}

            {/* Related Products */}
            {post.relatedProducts?.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Rental Products
                </h2>
                <BlogRelatedProducts products={post.relatedProducts} />
              </section>
            )}

            
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28 h-fit">
            {/* CTA */}
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help Planning Your Event?
              </h3>

              <div className="space-y-4">
                <a
                  href="tel:+918839931558"
                  className="block text-center bg-[#003459] text-white py-3 rounded-lg font-medium hover:bg-[#002a3f] transition"
                >
                  Call Now
                </a>

                <a
                  href={`https://wa.me/918839931558?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Related Articles */}
            {post.internalLinks?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Related Articles
                </h3>

                <div className="divide-y divide-gray-200">
                  {post.internalLinks.map((link) => (
                    <Link
                      key={link.url}
                      href={link.url}
                      className="block py-4 text-sm font-medium text-gray-700 hover:text-[#003459] transition"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
