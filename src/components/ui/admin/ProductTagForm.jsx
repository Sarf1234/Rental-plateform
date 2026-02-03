"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createSlug } from "@/utils/createSlug";
import { toast } from "sonner";

export default function ProductTagForm({
  initialData = {},
  onSubmit,
}) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(initialData.name || "");
  const [slug, setSlug] = useState(initialData.slug || "");
  const [isActive, setIsActive] = useState(
    initialData.isActive ?? true
  );

  const [seo, setSeo] = useState({
    metaTitle: initialData.seo?.metaTitle || "",
    metaDescription:
      initialData.seo?.metaDescription || "",
    metaKeywords: (initialData.seo?.metaKeywords || []).join(
      ", "
    ),
    canonicalUrl:
      initialData.seo?.canonicalUrl || "",
    noIndex: !!initialData.seo?.noIndex,
  });

  useEffect(() => {
    if (!initialData.slug) {
      setSlug(createSlug(name));
    }
  }, [name]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Tag name required");
    }

    const payload = {
      name: name.trim(),
      slug,
      isActive,
      seo: {
        metaTitle: seo.metaTitle || name,
        metaDescription: seo.metaDescription,
        metaKeywords: seo.metaKeywords
          ? seo.metaKeywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
        canonicalUrl: seo.canonicalUrl,
        noIndex: seo.noIndex,
      },
    };

    try {
      setLoading(true);
      await onSubmit(payload);
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label>Tag Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. premium"
            />
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) =>
                setSlug(createSlug(e.target.value))
              }
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white border rounded-md p-4">
            <Label className="block mb-2">Active</Label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) =>
                setIsActive(e.target.checked)
              }
              className="accent-indigo-600"
            />
          </div>

          <div className="bg-white border rounded-md p-4 space-y-3">
            <div className="font-medium">SEO</div>

            <Input
              placeholder="Meta title"
              value={seo.metaTitle}
              onChange={(e) =>
                setSeo({ ...seo, metaTitle: e.target.value })
              }
            />

            <Textarea
              rows={3}
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
              placeholder="Meta keywords (comma separated)"
              value={seo.metaKeywords}
              onChange={(e) =>
                setSeo({
                  ...seo,
                  metaKeywords: e.target.value,
                })
              }
            />

            <Input
              placeholder="Canonical URL"
              value={seo.canonicalUrl}
              onChange={(e) =>
                setSeo({
                  ...seo,
                  canonicalUrl: e.target.value,
                })
              }
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={seo.noIndex}
                onChange={(e) =>
                  setSeo({
                    ...seo,
                    noIndex: e.target.checked,
                  })
                }
              />
              No index
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Saving…" : "Save Tag"}
          </Button>
        </aside>
      </div>
    </form>
  );
}
