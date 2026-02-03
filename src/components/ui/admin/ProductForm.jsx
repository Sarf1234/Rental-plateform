"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { apiRequest } from "@/lib/api";
import { createSlug } from "@/utils/createSlug";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ---------------- CHIP ---------------- */
function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-sm border border-rose-100">
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-600 text-xs"
          aria-label={`Remove ${children}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

/* ---------------- MULTI SELECT ---------------- */
function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const filtered = options.filter((o) =>
    (o.name || "")
      .toString()
      .toLowerCase()
      .includes(q.toLowerCase()),
  );

  function toggle(id) {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  }

  function removeChip(id) {
    onChange(value.filter((v) => v !== id));
  }

  return (
    <div className="relative" ref={ref}>
      <Label className="block text-sm font-medium text-rose-700 mb-1">
        {label}
      </Label>

      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full min-h-[44px] text-left px-3 py-2 bg-white border border-rose-100 rounded-md flex items-center gap-2 flex-wrap"
        aria-expanded={open}
      >
        {value.length === 0 ? (
          <span className="text-sm text-gray-400">{placeholder}</span>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {value.map((id) => {
              const opt = options.find((o) => o._id === id);
              return (
                <Chip key={id} onRemove={() => removeChip(id)}>
                  {opt ? opt.name : id}
                </Chip>
              );
            })}
          </div>
        )}
        <span className="ml-auto text-xs text-rose-500">
          {value.length}
        </span>
      </button>

      {open && (
        <div className="absolute z-40 left-0 right-0 mt-2 bg-white border border-rose-100 rounded-md shadow-md max-h-56 overflow-auto p-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="w-full px-3 py-2 mb-2 border rounded text-sm"
          />
          <div className="space-y-1">
            {filtered.map((o) => {
              const checked = value.includes(o._id);
              return (
                <label
                  key={o._id}
                  className="flex items-center gap-2 px-2 py-2 rounded hover:bg-rose-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(o._id)}
                    className="w-4 h-4 accent-rose-600"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-rose-700">
                      {o.name}
                    </div>
                  </div>
                </label>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-sm text-gray-400 px-2 py-2">
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PRODUCT FORM
========================================================= */

export default function ProductForm({ initialData = {}, onSubmit }) {
  const [loading, setLoading] = useState(false);

  /* CORE */
  const [title, setTitle] = useState(initialData.title || "");
  const [slug, setSlug] = useState(initialData.slug || "");
  const [description, setDescription] = useState(
    initialData.description || "",
  );

  /* MEDIA */
  const [images, setImages] = useState(initialData.images || []);

  /* RELATIONS */
  const [categories, setCategories] = useState(
    (initialData.categories || []).map((c) => c._id || c),
  );
  const [tags, setTags] = useState(
    (initialData.tags || []).map((t) => t._id || t),
  );
  const [cities, setCities] = useState(
    (initialData.serviceAreas || []).map((c) => c._id || c),
  );

  /* PRICING */
  const [pricing, setPricing] = useState({
    unit: initialData.pricing?.unit || "day",
    minPrice: initialData.pricing?.minPrice || "",
    maxPrice: initialData.pricing?.maxPrice || "",
    discountedPrice: initialData.pricing?.discountedPrice || "",
    securityDeposit: initialData.pricing?.securityDeposit || "",
    serviceCharge: initialData.pricing?.serviceCharge || "",
  });

  /* FAQ */
  const [faqs, setFaqs] = useState(initialData.faqs || []);

  /* TERMS */
  const [terms, setTerms] = useState(
    initialData.termsAndConditions || "",
  );

  /* STATUS */
  const [status, setStatus] = useState(
    initialData.status || "draft",
  );

  /* HIGHLIGHTS */
  const [highlights, setHighlights] = useState({
    isTopRented: initialData.highlights?.isTopRented || false,
    isBestDeal: initialData.highlights?.isBestDeal || false,
    isNewProduct: initialData.highlights?.isNewProduct || false,
    isFeatured: initialData.highlights?.isFeatured || false,
  });

  /* SEO */
  const [seo, setSeo] = useState({
    metaTitle: initialData.seo?.metaTitle || "",
    metaDescription: initialData.seo?.metaDescription || "",
    metaKeywords: (initialData.seo?.metaKeywords || []).join(", "),
    canonicalUrl: initialData.seo?.canonicalUrl || "",
    noIndex: initialData.seo?.noIndex || false,
  });

  /* LIST DATA */
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    apiRequest("/api/products/categories").then((r) =>
      setAllCategories(r.data || []),
    );
    apiRequest("/api/products/tags").then((r) =>
      setAllTags(r.data || []),
    );
    apiRequest("/api/cities").then((r) =>
      setAllCities(r.data || []),
    );
  }, []);

  useEffect(() => {
    if (!initialData.slug) setSlug(createSlug(title));
  }, [title]);

  /* IMAGE UPLOAD */
  async function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await apiRequest("/api/upload", "POST", fd);
      const url = res.data?.url || res.url;

      setImages((prev) => [...prev, url]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      toast.error("Image upload failed");
    }
  }

  function removeImage(url) {
    setImages(images.filter((i) => i !== url));
  }

  /* FAQ HANDLERS */
  function addFaq() {
    setFaqs([...faqs, { question: "", answer: "", isActive: true }]);
  }

  function updateFaq(i, key, val) {
    const copy = [...faqs];
    copy[i][key] = val;
    setFaqs(copy);
  }

  function removeFaq(i) {
    setFaqs(faqs.filter((_, idx) => idx !== i));
  }

  /* SUBMIT */
  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !images.length ||
      !categories.length ||
      !terms
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (+pricing.minPrice > +pricing.maxPrice) {
      toast.error("Min price cannot be greater than max price");
      return;
    }

    const payload = {
      title,
      slug,
      description,
      images,
      categories,
      tags,
      serviceAreas: cities,
      pricing: {
        unit: pricing.unit,
        minPrice: Number(pricing.minPrice),
        maxPrice: Number(pricing.maxPrice),
        discountedPrice: pricing.discountedPrice
          ? Number(pricing.discountedPrice)
          : undefined,
        securityDeposit: Number(pricing.securityDeposit || 0),
        serviceCharge: Number(pricing.serviceCharge || 0),
      },
      faqs,
      termsAndConditions: terms,
      status,
      highlights,
      seo: {
        ...seo,
        metaKeywords: seo.metaKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      },
    };

    try {
      setLoading(true);
      await onSubmit(payload);
      toast.success("Product saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto p-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* TITLE */}
          <div className="bg-white border border-rose-50 rounded-md p-4 shadow-sm space-y-3">
            <div>
              <Label className="text-sm font-medium text-rose-700">
                Product Title *
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product title..."
                className="mt-2"
              />
              <div className="text-xs text-gray-400 mt-1">
                Slug: /products/{slug}
              </div>
            </div>
          </div>

          {/* IMAGES */}
          <div className="bg-white border border-rose-50 rounded-md p-4 shadow-sm space-y-4">
            <div className="text-sm font-medium text-rose-700">
              Images *
            </div>

            <label className="w-full flex items-center justify-center border border-dashed border-rose-200 rounded-md p-6 bg-rose-50 text-center cursor-pointer">
              <div>
                <div className="text-rose-600 font-medium">
                  Upload product image
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  PNG/JPG/WEBP
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="sr-only"
                />
              </div>
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img) => (
                  <div
                    key={img}
                    className="relative group"
                  >
                    <img
                      src={img}
                      className="h-28 w-full object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRICING */}
          <div className="bg-white border border-rose-50 rounded-md p-4 shadow-sm space-y-4">
            <div className="text-sm font-medium text-rose-700">
              Pricing
            </div>

            <select
              className="w-full px-3 py-2 border border-rose-100 rounded-md"
              value={pricing.unit}
              onChange={(e) =>
                setPricing({
                  ...pricing,
                  unit: e.target.value,
                })
              }
            >
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="event">Event</option>
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Min price"
                value={pricing.minPrice}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    minPrice: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Max price"
                value={pricing.maxPrice}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    maxPrice: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Discounted price"
                value={pricing.discountedPrice}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    discountedPrice: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Security deposit"
                value={pricing.securityDeposit}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    securityDeposit: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Service charge"
                value={pricing.serviceCharge}
                onChange={(e) =>
                  setPricing({
                    ...pricing,
                    serviceCharge: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white border border-rose-50 rounded-md p-4 shadow-sm space-y-3">
            <div className="text-sm font-medium text-rose-700">
              Description *
            </div>
            <div className="border rounded-md">
              <JoditEditor
                value={description}
                onBlur={(c) => setDescription(c)}
              />
            </div>
          </div>

          {/* TERMS */}
          <div className="bg-white border border-rose-50 rounded-md p-4 shadow-sm space-y-3">
            <div className="text-sm font-medium text-rose-700">
              Terms & Conditions *
            </div>
            <div className="border rounded-md">
              <JoditEditor
                value={terms}
                onBlur={(c) => setTerms(c)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <aside className="space-y-4">
          <div className="bg-white border border-rose-50 rounded-md p-4 shadow-sm space-y-4">
            <MultiSelect
              label="Categories *"
              options={allCategories}
              value={categories}
              onChange={setCategories}
              placeholder="Select categories"
            />

            <MultiSelect
              label="Tags"
              options={allTags}
              value={tags}
              onChange={setTags}
              placeholder="Select tags"
            />

            <MultiSelect
              label="Cities"
              options={allCities}
              value={cities}
              onChange={setCities}
              placeholder="Service areas"
            />
          </div>

          {/* FAQ */}
          <div className="bg-white border border-rose-50 rounded-md p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-rose-700">
                FAQs
              </div>
              <button
                type="button"
                onClick={addFaq}
                className="text-sm text-rose-600 hover:underline"
              >
                + Add FAQ
              </button>
            </div>

            {faqs.map((f, i) => (
              <div
                key={i}
                className="border border-rose-100 rounded-md p-3 space-y-2"
              >
                <Input
                  placeholder="Question"
                  value={f.question}
                  onChange={(e) =>
                    updateFaq(i, "question", e.target.value)
                  }
                />
                <Textarea
                  placeholder="Answer"
                  value={f.answer}
                  onChange={(e) =>
                    updateFaq(i, "answer", e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeFaq(i)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* STATUS */}
          <div className="bg-white border border-rose-50 rounded-md p-4 shadow-sm">
            <Label className="text-sm font-medium text-rose-700">
              Status
            </Label>
            <select
              className="mt-2 w-full px-3 py-2 border border-rose-100 rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* HIGHLIGHTS */}
          <div className="bg-white border border-rose-50 rounded-md p-4 shadow-sm space-y-3">
            <div className="text-sm font-medium text-rose-700">
              Highlights
            </div>
            {Object.keys(highlights).map((k) => (
              <label
                key={k}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700">{k}</span>
                <input
                  type="checkbox"
                  checked={highlights[k]}
                  onChange={() =>
                    setHighlights({
                      ...highlights,
                      [k]: !highlights[k],
                    })
                  }
                  className="w-4 h-4 accent-rose-600"
                />
              </label>
            ))}
          </div>

          {/* SEO */}
          <div className="bg-white border border-rose-50 rounded-md p-4 shadow-sm space-y-3">
            <div className="text-sm font-medium text-rose-700">
              SEO
            </div>

            <Input
              placeholder="Meta title"
              value={seo.metaTitle}
              onChange={(e) =>
                setSeo({ ...seo, metaTitle: e.target.value })
              }
            />
            <Textarea
              placeholder="Meta description"
              value={seo.metaDescription}
              onChange={(e) =>
                setSeo({
                  ...seo,
                  metaDescription: e.target.value,
                })
              }
            />
            <Input
              placeholder="Meta keywords"
              value={seo.metaKeywords}
              onChange={(e) =>
                setSeo({
                  ...seo,
                  metaKeywords: e.target.value,
                })
              }
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={seo.noIndex}
                onChange={() =>
                  setSeo({ ...seo, noIndex: !seo.noIndex })
                }
                className="w-4 h-4 accent-rose-600"
              />
              No Index
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </aside>
      </div>
    </form>
  );
}
