"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { apiRequest } from "@/lib/api";
import { createSlug } from "@/utils/createSlug";
import { toast } from "sonner";

/* shadcn */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ================= CHIP ================= */

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-sm border border-rose-100">
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-600 text-xs"
        >
          ×
        </button>
      )}
    </span>
  );
}

/* ================= SEARCHABLE MULTI SELECT ================= */

function SearchableMultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
  displayKey = "name",
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const filtered = options.filter((o) =>
    (o[displayKey] || "")
      .toString()
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  function toggle(id) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
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
      >
        {value.length === 0 ? (
          <span className="text-sm text-gray-400">
            {placeholder}
          </span>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {value.map((id) => {
              const opt = options.find((o) => o._id === id);
              return (
                <Chip
                  key={id}
                  onRemove={() => toggle(id)}
                >
                  {opt ? opt[displayKey] : id}
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
            {filtered.map((opt) => {
              const id = opt._id;
              const checked = value.includes(id);

              return (
                <label
                  key={id}
                  className="flex items-center gap-2 px-2 py-2 rounded hover:bg-rose-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(id)}
                    className="w-4 h-4 accent-rose-600"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-rose-700">
                      {opt[displayKey]}
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

/* ================= IMAGE UPLOAD ================= */

function ImageUpload({ images, setImages }) {
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await apiRequest("/api/upload", "POST", fd);
      const url = res.data?.url || res.url;
      setImages((prev) => [...prev, url]);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-rose-700">
        Service Images
      </Label>

      <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-rose-200 bg-rose-50 text-center hover:bg-rose-100 transition">
        <div>
          <div className="text-rose-600 font-medium">
            Click to upload image
          </div>
          <div className="text-xs text-gray-500 mt-1">
            PNG / JPG supported
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleFile}
        />
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img) => (
            <div key={img} className="relative group">
              <img
                src={img}
                className="h-28 w-full rounded-md object-cover border"
              />
              <button
                type="button"
                onClick={() =>
                  setImages(images.filter((i) => i !== img))
                }
                className="absolute top-1 right-1 rounded bg-black/70 px-2 text-white opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========================================================= */
/* ==================== MAIN FORM =========================== */
/* ========================================================= */

export default function ServiceForm({
  initialData = {},
  onSubmit,
}) {
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(
    initialData.title || ""
  );
  const [slug, setSlug] = useState(
    initialData.slug || ""
  );
  const [description, setDescription] = useState(
    initialData.description || ""
  );
  const [serviceType, setServiceType] = useState(
    initialData.serviceType || "on_site"
  );

  const [images, setImages] = useState(
    initialData.images || []
  );

  const [serviceAreas, setServiceAreas] = useState(
    (initialData.serviceAreas || []).map(
      (c) => c._id || c
    )
  );

  const [providers, setProviders] = useState(
    (initialData.providers || []).map(
      (p) => p._id || p
    )
  );

  const [products, setProducts] = useState(
    (initialData.products || []).map(
      (p) => p._id || p
    )
  );

  const [cities, setCities] = useState([]);
  const [businessList, setBusinessList] =
    useState([]);
  const [productList, setProductList] =
    useState([]);

  const [pricing, setPricing] = useState({
    type: initialData.pricing?.type || "quote",
    amount: initialData.pricing?.amount || "",
    label: initialData.pricing?.label || "",
  });

  const [contactMode, setContactMode] = useState(
    initialData.contactMode || "call_whatsapp"
  );
  const [callNumber, setCallNumber] = useState(
    initialData.callNumber || ""
  );
  const [whatsappNumber, setWhatsappNumber] =
    useState(initialData.whatsappNumber || "");

  const [features, setFeatures] = useState(
    initialData.features || []
  );

  const [serviceProcess, setServiceProcess] =
    useState(initialData.serviceProcess || []);

  const [faqs, setFaqs] = useState(
    initialData.faqs || []
  );
  const [category, setCategory] = useState(
    initialData.category?._id || initialData.category || ""
  );

  const [categoryList, setCategoryList] = useState([]);

  const [isFeatured, setIsFeatured] = useState(
    !!initialData.isFeatured
  );
  const [isTopService, setIsTopService] =
    useState(!!initialData.isTopService);
  const [isBestService, setIsBestService] =
    useState(!!initialData.isBestService);
  const [priority, setPriority] = useState(
    initialData.priority || 0
  );
  const [status, setStatus] = useState(
    initialData.status || "draft"
  );

  const [seo, setSeo] = useState({
    metaTitle:
      initialData.seo?.metaTitle || "",
    metaDescription:
      initialData.seo?.metaDescription || "",
    metaKeywords:
      (initialData.seo?.metaKeywords || []).join(
        ", "
      ),
    canonicalUrl:
      initialData.seo?.canonicalUrl || "",
    noIndex: !!initialData.seo?.noIndex,
    ogTitle: initialData.seo?.ogTitle || "",
    ogDescription:
      initialData.seo?.ogDescription || "",
    ogImage:
      initialData.seo?.ogImage || "",
  });

  /* ---------- LOAD ---------- */

  useEffect(() => {
    async function load() {
      try {
        const [c, b, p, sc] =
          await Promise.all([
            apiRequest("/api/cities"),
            apiRequest("/api/business"),
            apiRequest("/api/products"),
            apiRequest("/api/service-categories"),
          ]);

        setCities(c.data || []);
        setBusinessList(b.data || []);
        setProductList(p.data || []);
        setCategoryList(sc.data || []);
      } catch {
        toast.error(
          "Failed to load dropdown data"
        );
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!initialData.slug) {
      setSlug(createSlug(title));
    }
  }, [title]);

  /* ---------- SUBMIT ---------- */

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !category ||
      providers.length === 0
    ) {
      return toast.error(
        "Title, description and at least one provider are required"
      );
    }

    const payload = {
      title,
      slug,
      description,
      serviceType,
      category,
      images,
      serviceAreas,
      providers,
      products,
      pricing: {
        type: pricing.type,
        amount: pricing.amount
          ? Number(pricing.amount)
          : undefined,
        label:
          pricing.label || undefined,
      },
      contactMode,
      callNumber,
      whatsappNumber,
      features,
      serviceProcess,
      faqs,
      seo: {
        ...seo,
        metaKeywords: seo.metaKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      },
      isFeatured,
      isTopService,
      isBestService,
      priority: Number(priority),
      status,
    };

    try {
      setLoading(true);
      await onSubmit(payload);
      toast.success(
        "Service saved successfully"
      );
    } catch (err) {
      toast.error(
        err.message || "Save failed"
      );
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto p-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN */}
        <div className="lg:col-span-2 space-y-6">

          {/* CORE */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm space-y-5">
            <div>
              <Label className="text-sm font-medium text-rose-700">
                Service Title *
              </Label>
              <Input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter service title..."
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-rose-700">
                Slug
              </Label>
              <Input
                value={slug}
                onChange={(e) =>
                  setSlug(
                    createSlug(e.target.value)
                  )
                }
                placeholder="auto-generated"
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-rose-700">
                Description *
              </Label>
              <div className="mt-2 border rounded-md">
                <JoditEditor
                  value={description}
                  onBlur={(v) =>
                    setDescription(v)
                  }
                />
              </div>
            </div>

            <div className="max-w-xs">
              <Label className="text-sm font-medium text-rose-700">
                Service Type
              </Label>
              <Select
                value={serviceType}
                onValueChange={
                  setServiceType
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_site">
                    On Site
                  </SelectItem>
                  <SelectItem value="remote">
                    Remote
                  </SelectItem>
                  <SelectItem value="hybrid">
                    Hybrid
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="max-w-xs">
  <Label className="text-sm font-medium text-rose-700">
    Service Category *
  </Label>

  <Select
    value={category}
    onValueChange={setCategory}
  >
    <SelectTrigger className="mt-2">
      <SelectValue placeholder="Select category" />
    </SelectTrigger>
    <SelectContent>
      {categoryList.map((c) => (
        <SelectItem key={c._id} value={c._id}>
          {c.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

          </div>

          {/* IMAGES */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm">
            <ImageUpload
              images={images}
              setImages={setImages}
            />
          </div>

          {/* PROVIDERS */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm">
            <SearchableMultiSelect
              label="Business Providers *"
              options={businessList}
              value={providers}
              onChange={setProviders}
              placeholder="Select providers"
              displayKey="name"
            />
          </div>

          {/* PRODUCTS */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm">
            <SearchableMultiSelect
              label="Products"
              options={productList}
              value={products}
              onChange={setProducts}
              placeholder="Select products"
              displayKey="title"
            />
          </div>

          {/* SERVICE AREAS */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm">
            <SearchableMultiSelect
              label="Service Areas"
              options={cities}
              value={serviceAreas}
              onChange={setServiceAreas}
              placeholder="Select cities"
              displayKey="name"
            />
          </div>

          {/* FEATURES, PROCESS, FAQ sections unchanged visually but preserved logic */}
          {/* (They remain identical in logic, only styled consistently) */}

          {/* FEATURES */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-rose-700">
                Features
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFeatures([
                    ...features,
                    "",
                  ])
                }
              >
                + Add Feature
              </Button>
            </div>

            {features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={f}
                  placeholder={`Feature ${i + 1}`}
                  onChange={(e) => {
                    const copy = [
                      ...features,
                    ];
                    copy[i] =
                      e.target.value;
                    setFeatures(copy);
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setFeatures(
                      features.filter(
                        (_, idx) =>
                          idx !== i
                      )
                    )
                  }
                >
                  ×
                </Button>
              </div>
            ))}
          </div>

          {/* SERVICE PROCESS */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-rose-700">
                Service Process
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setServiceProcess([
                    ...serviceProcess,
                    {
                      step:
                        serviceProcess.length +
                        1,
                      title: "",
                      description: "",
                    },
                  ])
                }
              >
                + Add Step
              </Button>
            </div>

            {serviceProcess.map((s, i) => (
              <div
                key={i}
                className="border rounded-md p-4 space-y-3"
              >
                <div className="text-sm font-medium text-gray-700">
                  Step {s.step}
                </div>

                <Input
                  value={s.title}
                  placeholder="Step title"
                  onChange={(e) => {
                    const copy = [
                      ...serviceProcess,
                    ];
                    copy[i].title =
                      e.target.value;
                    setServiceProcess(
                      copy
                    );
                  }}
                />

                <Textarea
                  value={s.description}
                  placeholder="Step description"
                  onChange={(e) => {
                    const copy = [
                      ...serviceProcess,
                    ];
                    copy[i].description =
                      e.target.value;
                    setServiceProcess(
                      copy
                    );
                  }}
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const copy =
                      serviceProcess
                        .filter(
                          (_, idx) =>
                            idx !== i
                        );
                    copy.forEach(
                      (s, idx) =>
                        (s.step =
                          idx + 1)
                    );
                    setServiceProcess(
                      copy
                    );
                  }}
                >
                  Remove Step
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-rose-700">
                FAQs
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFaqs([
                    ...faqs,
                    {
                      question: "",
                      answer: "",
                      isActive: true,
                    },
                  ])
                }
              >
                + Add FAQ
              </Button>
            </div>

            {faqs.map((f, i) => (
              <div
                key={i}
                className="border rounded-md p-4 space-y-3"
              >
                <Input
                  value={f.question}
                  placeholder="Question"
                  onChange={(e) => {
                    const copy = [
                      ...faqs,
                    ];
                    copy[i].question =
                      e.target.value;
                    setFaqs(copy);
                  }}
                />

                <Textarea
                  value={f.answer}
                   placeholder="Answer"
                  onChange={(e) => {
                    const copy = [
                      ...faqs,
                    ];
                    copy[i].answer =
                      e.target.value;
                    setFaqs(copy);
                  }}
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setFaqs(
                      faqs.filter(
                        (_, idx) =>
                          idx !== i
                      )
                    )
                  }
                >
                  Remove FAQ
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR REMAINS IDENTICAL LOGIC WITH SAME STRUCTURE AS ORIGINAL */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Pricing, Contact, SEO, Visibility, Submit */}
          {/* (All preserved exactly — no payload or logic changed) */}

          {/* PRICING */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm space-y-4">
            <div className="text-sm font-medium text-rose-700">
              Pricing
            </div>

            <Select
              value={pricing.type}
              onValueChange={(v) =>
                setPricing({
                  ...pricing,
                  type: v,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quote">
                  Quote
                </SelectItem>
                <SelectItem value="fixed">
                  Fixed
                </SelectItem>
                <SelectItem value="starting_from">
                  Starting From
                </SelectItem>
              </SelectContent>
            </Select>

            {pricing.type !== "quote" && (
              <div className="space-y-3">
                <Input
                  type="number"
                  value={pricing.amount}
                  placeholder="Amount"
                  onChange={(e) =>
                    setPricing({
                      ...pricing,
                      amount:
                        e.target.value,
                    })
                  }
                />
                <Input
                  value={pricing.label}
                  placeholder="Label (e.g. Starting from ₹999)"
                  onChange={(e) =>
                    setPricing({
                      ...pricing,
                      label:
                        e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>

          {/* CONTACT */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm space-y-4">
            <div className="text-sm font-medium text-rose-700">
              Contact / CTA
            </div>

            <Select
              value={contactMode}
              onValueChange={
                setContactMode
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">
                  Call
                </SelectItem>
                <SelectItem value="whatsapp">
                  WhatsApp
                </SelectItem>
                <SelectItem value="call_whatsapp">
                  Call + WhatsApp
                </SelectItem>
              </SelectContent>
            </Select>

            {(contactMode === "call" ||
              contactMode ===
                "call_whatsapp") && (
              <Input
                value={callNumber}
                placeholder="Call number"
                onChange={(e) =>
                  setCallNumber(
                    e.target.value
                  )
                }
              />
            )}

            {(contactMode ===
              "whatsapp" ||
              contactMode ===
                "call_whatsapp") && (
              <Input
                value={whatsappNumber}
                placeholder="WhatsApp number"
                onChange={(e) =>
                  setWhatsappNumber(
                    e.target.value
                  )
                }
              />
            )}
          </div>

          {/* SEO */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm space-y-4">
            <div className="text-sm font-medium text-rose-700">
              SEO
            </div>

            <Input
              value={seo.metaTitle}
              placeholder="Meta title"
              onChange={(e) =>
                setSeo({
                  ...seo,
                  metaTitle:
                    e.target.value,
                })
              }
            />

            <Textarea
              value={seo.metaDescription}
              placeholder="Meta description"
              onChange={(e) =>
                setSeo({
                  ...seo,
                  metaDescription:
                    e.target.value,
                })
              }
            />

            <Input
              value={seo.metaKeywords}
              placeholder="Meta keywords (comma separated)"
              onChange={(e) =>
                setSeo({
                  ...seo,
                  metaKeywords:
                    e.target.value,
                })
              }
            />

            <Input
              value={seo.canonicalUrl}
              placeholder="Canonical URL"
              onChange={(e) =>
                setSeo({
                  ...seo,
                  canonicalUrl:
                    e.target.value,
                })
              }
            />

            <div className="flex items-center gap-2">
              <Checkbox
                checked={seo.noIndex}
                onCheckedChange={(v) =>
                  setSeo({
                    ...seo,
                    noIndex: !!v,
                  })
                }
              />
              <Label>No Index</Label>
            </div>

            <Input
              value={seo.ogTitle}
              placeholder="OG Title"
              onChange={(e) =>
                setSeo({
                  ...seo,
                  ogTitle:
                    e.target.value,
                })
              }
            />

            <Textarea
              value={seo.ogDescription}
              placeholder="OG Description"
              onChange={(e) =>
                setSeo({
                  ...seo,
                  ogDescription:
                    e.target.value,
                })
              }
            />

            <Input
              value={seo.ogImage}
              placeholder="OG Image URL"
              onChange={(e) =>
                setSeo({
                  ...seo,
                  ogImage:
                    e.target.value,
                })
              }
            />
          </div>

          {/* VISIBILITY */}
          <div className="bg-white border border-rose-50 rounded-md p-6 shadow-sm space-y-4">
            <div className="text-sm font-medium text-rose-700">
              Visibility & Status
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Featured
                </span>
                <Checkbox
                  checked={isFeatured}
                  onCheckedChange={(v) =>
                    setIsFeatured(
                      !!v
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Top Service
                </span>
                <Checkbox
                  checked={isTopService}
                  onCheckedChange={(v) =>
                    setIsTopService(
                      !!v
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Best Service
                </span>
                <Checkbox
                  checked={isBestService}
                  onCheckedChange={(v) =>
                    setIsBestService(
                      !!v
                    )
                  }
                />
              </div>

              <Input
                type="number"
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value
                  )
                }
              />

              <Select
                value={status}
                onValueChange={
                  setStatus
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    Draft
                  </SelectItem>
                  <SelectItem value="published">
                    Published
                  </SelectItem>
                  <SelectItem value="archived">
                    Archived
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700"
          >
            {loading
              ? "Saving..."
              : "Save Service"}
          </Button>
        </aside>
      </div>
    </form>
  );
}
