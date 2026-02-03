"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { createSlug } from "@/utils/createSlug";
import { toast } from "sonner";

export default function ProductCategoryForm({ initialData = {}, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData.name || "");
  const [slug, setSlug] = useState(initialData.slug || "");
  const [parent, setParent] = useState(initialData.parent?._id || "");
  const [isActive, setIsActive] = useState(initialData.isActive ?? true);

  const [seo, setSeo] = useState({
    metaTitle: initialData.seo?.metaTitle || "",
    metaDescription: initialData.seo?.metaDescription || "",
    metaKeywords: (initialData.seo?.metaKeywords || []).join(", "),
    canonicalUrl: initialData.seo?.canonicalUrl || "",
    noIndex: !!initialData.seo?.noIndex,
  });

  const [parents, setParents] = useState([]);

  useEffect(() => {
    if (!initialData.slug) setSlug(createSlug(name));
  }, [name]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("/api/products/categories");
        setParents(res.data || []);
      } catch {
        toast.error("Failed to load parent categories");
      }
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name required");

    const payload = {
      name: name.trim(),
      slug,
      parent: parent || null,
      isActive,
      seo: {
        metaTitle: seo.metaTitle || name,
        metaDescription: seo.metaDescription,
        metaKeywords: seo.metaKeywords
          ? seo.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
          : [],
        canonicalUrl: seo.canonicalUrl,
        noIndex: seo.noIndex,
      },
    };

    try {
      setLoading(true);
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e)=>setName(e.target.value)} />
          </div>

          <div>
            <Label>Slug</Label>
            <Input value={slug} onChange={(e)=>setSlug(createSlug(e.target.value))} />
          </div>

          <div>
            <Label>Parent Category</Label>
            <select
              value={parent}
              onChange={(e)=>setParent(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">— None —</option>
              {parents
                .filter(p => p._id !== initialData._id)
                .map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
            </select>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white border rounded-md p-4">
            <Label className="block mb-2">Active</Label>
            <input type="checkbox" checked={isActive} onChange={(e)=>setIsActive(e.target.checked)} />
          </div>

          <div className="bg-white border rounded-md p-4 space-y-3">
            <div className="font-medium">SEO</div>
            <Input placeholder="Meta title" value={seo.metaTitle} onChange={(e)=>setSeo({...seo, metaTitle: e.target.value})} />
            <Textarea rows={3} placeholder="Meta description" value={seo.metaDescription} onChange={(e)=>setSeo({...seo, metaDescription: e.target.value})} />
            <Input placeholder="Meta keywords (comma separated)" value={seo.metaKeywords} onChange={(e)=>setSeo({...seo, metaKeywords: e.target.value})} />
            <Input placeholder="Canonical URL" value={seo.canonicalUrl} onChange={(e)=>setSeo({...seo, canonicalUrl: e.target.value})} />
            <label className="flex gap-2 items-center text-sm">
              <input type="checkbox" checked={seo.noIndex} onChange={(e)=>setSeo({...seo, noIndex: e.target.checked})} />
              No index
            </label>
          </div>

          <Button className="w-full bg-indigo-600" disabled={loading}>
            {loading ? "Saving…" : "Save Category"}
          </Button>
        </aside>
      </div>
    </form>
  );
}
