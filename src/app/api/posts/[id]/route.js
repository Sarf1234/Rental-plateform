import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import Tag from "@/models/Tag";
import { createSlug } from "@/utils/createSlug";
import { calculateReadTime } from "@/utils/readTime";
import sanitizeHtml from "sanitize-html";
import { requireAdmin } from "@/lib/protectRoute";
import { deleteImage } from "@/lib/cloudinary"; // if you store public_id
import Service from "@/models/Serviceproduct";
import Product from "@/models/Product";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid id" }),
        { status: 400 }
      );
    }

    const post = await Post.findById(id)
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate("relatedServices")     // NEW
      .populate("relatedProducts")     // NEW
      .lean();                         // performance

    if (!post) {
      return new Response(
        JSON.stringify({ success: false, message: "Post not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: post }),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/posts/:id error", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const { id } = await params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid id" }),
        { status: 400 }
      );
    }

    const body = await req.json();
    const post = await Post.findById(id);

    if (!post) {
      return new Response(
        JSON.stringify({ success: false, message: "Post not found" }),
        { status: 404 }
      );
    }

    // ---------------- SANITIZE CONTENT ----------------
    if (body.content) {
      if (body.content.length > 300000) {
        return new Response(
          JSON.stringify({ success: false, message: "Content too large" }),
          { status: 400 }
        );
      }

      body.content = sanitizeHtml(body.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "img",
          "h1",
          "h2",
          "span",
        ]),
        allowedAttributes: {
          a: ["href", "name", "target"],
          img: ["src", "alt", "width", "height"],
          "*": ["class", "style"],
        },
      });

      post.readTime = calculateReadTime(body.content);
      post.content = body.content;
    }

    // ---------------- CATEGORIES ----------------
    if (body.categories) {
      if (!Array.isArray(body.categories) || !body.categories.length) {
        return new Response(
          JSON.stringify({ success: false, message: "At least one category required" }),
          { status: 400 }
        );
      }

      const foundCategories = await Category.find({
        _id: { $in: body.categories },
      });

      if (foundCategories.length !== body.categories.length) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid categories" }),
          { status: 400 }
        );
      }

      post.categories = body.categories;
    }

    // ---------------- TAGS ----------------
    if (body.tags) {
      if (!Array.isArray(body.tags)) {
        return new Response(
          JSON.stringify({ success: false, message: "Tags must be array" }),
          { status: 400 }
        );
      }

      const foundTags = await Tag.find({
        _id: { $in: body.tags },
      });

      if (foundTags.length !== body.tags.length) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid tags" }),
          { status: 400 }
        );
      }

      post.tags = body.tags;
    }

    // ================= NEW FIELDS =================

    // ---------- RELATED SERVICES ----------
    if (body.relatedServices !== undefined) {
      if (!Array.isArray(body.relatedServices)) {
        return new Response(
          JSON.stringify({ success: false, message: "relatedServices must be array" }),
          { status: 400 }
        );
      }

      if (body.relatedServices.length > 10) {
        return new Response(
          JSON.stringify({ success: false, message: "Max 10 related services allowed" }),
          { status: 400 }
        );
      }

      const foundServices = await Service.find({
        _id: { $in: body.relatedServices },
      });

      if (foundServices.length !== body.relatedServices.length) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid related services" }),
          { status: 400 }
        );
      }

      post.relatedServices = body.relatedServices;
    }

    // ---------- RELATED PRODUCTS ----------
    if (body.relatedProducts !== undefined) {
      if (!Array.isArray(body.relatedProducts)) {
        return new Response(
          JSON.stringify({ success: false, message: "relatedProducts must be array" }),
          { status: 400 }
        );
      }

      if (body.relatedProducts.length > 10) {
        return new Response(
          JSON.stringify({ success: false, message: "Max 10 related products allowed" }),
          { status: 400 }
        );
      }

      const foundProducts = await Product.find({
        _id: { $in: body.relatedProducts },
      });

      if (foundProducts.length !== body.relatedProducts.length) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid related products" }),
          { status: 400 }
        );
      }

      post.relatedProducts = body.relatedProducts;
    }

    // ---------- FAQ ----------
    if (body.faqs !== undefined) {
      if (!Array.isArray(body.faqs)) {
        return new Response(
          JSON.stringify({ success: false, message: "FAQs must be array" }),
          { status: 400 }
        );
      }

      if (body.faqs.length > 15) {
        return new Response(
          JSON.stringify({ success: false, message: "Max 15 FAQs allowed" }),
          { status: 400 }
        );
      }

      const invalidFaq = body.faqs.some(
        (f) =>
          !f.question ||
          !f.answer ||
          typeof f.question !== "string" ||
          typeof f.answer !== "string"
      );

      if (invalidFaq) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid FAQ format" }),
          { status: 400 }
        );
      }

      post.faqs = body.faqs;
    }

    // ---------- SEO ----------
    if (body.seo !== undefined) {
      post.seo = {
        canonicalUrl: body.seo.canonicalUrl?.trim() || "",
        noIndex: !!body.seo.noIndex,
        ogTitle: body.seo.ogTitle || "",
        ogDescription: body.seo.ogDescription || "",
        ogImage: body.seo.ogImage || "",
      };
    }

    // ---------------- BASIC FIELDS ----------------
    const fields = [
      "title",
      "excerpt",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
      "isFeatured",
      "isTrending",
    ];

    fields.forEach((f) => {
      if (body[f] !== undefined) post[f] = body[f];
    });

    // ---------------- PUBLISHED ----------------
    if (body.published !== undefined) {
      const newPublished = !!body.published;

      if (newPublished && !post.published) {
        post.publishedAt = new Date();
      }

      if (!newPublished) {
        post.publishedAt = null;
      }

      post.published = newPublished;
    }

    // ---------------- SLUG ----------------
    if (body.title && body.title !== post.title) {
      let newSlug = createSlug(body.slug || body.title);

      const existing = await Post.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });

      if (existing) newSlug = `${newSlug}-${Date.now()}`;
      post.slug = newSlug;
    }

    await post.save();

    const updated = await Post.findById(post._id)
      .populate("categories")
      .populate("tags")
      .populate("relatedServices")
      .populate("relatedProducts");

    return new Response(
      JSON.stringify({
        success: true,
        data: updated,
        message: "Post updated",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /api/posts/:id error", err);

    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const { id } = await params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) return new Response(JSON.stringify({ success: false, message: "Invalid id" }), { status: 400 });

    const post = await Post.findByIdAndDelete(id);
    if (!post) return new Response(JSON.stringify({ success: false, message: "Post not found" }), { status: 404 });

    // optionally delete cover image
    if (post.coverImagePublicId) {
      try { await deleteImage(post.coverImagePublicId); } catch (e) { console.warn("Failed to delete post image", e); }
    }

    return new Response(JSON.stringify({ success: true, message: "Post deleted" }), { status: 200 });
  } catch (err) {
    console.error("DELETE /api/posts/:id error", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
