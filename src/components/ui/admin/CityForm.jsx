"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSlug } from "@/utils/createSlug";
import { toast } from "sonner";

export default function CityForm({
  initialData = {},
  onSubmit,
}) {
  const [loading, setLoading] = useState(false);

  /* ---------- CORE ---------- */
  const [name, setName] = useState(initialData.name || "");
  const [state, setState] = useState(initialData.state || "");
  const [slug, setSlug] = useState(initialData.slug || "");

  /* ---------- SEO ---------- */
  const [metaTitle, setMetaTitle] = useState(
    initialData.seo?.metaTitle || ""
  );
  const [metaDescription, setMetaDescription] = useState(
    initialData.seo?.metaDescription || ""
  );
  const [metaKeywords, setMetaKeywords] = useState(
    (initialData.seo?.metaKeywords || []).join(", ")
  );
  const [canonicalUrl, setCanonicalUrl] = useState(
    initialData.seo?.canonicalUrl || ""
  );
  const [noIndex, setNoIndex] = useState(
    !!initialData.seo?.noIndex
  );

  /* ---------- GEO ---------- */
  const [lat, setLat] = useState(initialData.geo?.lat || "");
  const [lng, setLng] = useState(initialData.geo?.lng || "");

  /* ---------- STATUS ---------- */
  const [isActive, setIsActive] = useState(
    initialData.isActive ?? true
  );

  /* ---------- AUTO SLUG ---------- */
  useEffect(() => {
    if (!initialData.slug) {
      setSlug(createSlug(`${name}-${state}`));
    }
  }, [name, state]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return toast.error("City name is required");
    if (!state.trim()) return toast.error("State is required");

    const payload = {
      name: name.trim(),
      state: state.trim(),
      slug: slug || createSlug(`${name}-${state}`),
      isActive,

      seo: {
        metaTitle: metaTitle || name,
        metaDescription,
        metaKeywords: metaKeywords
          ? metaKeywords.split(",").map(k => k.trim()).filter(Boolean)
          : [],
        canonicalUrl,
        noIndex,
      },

      geo: {
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
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
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== MAIN COLUMN ===== */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label className="text-sm font-medium text-blue-700">
              City Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Patna"
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-blue-700">
              State
            </Label>
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Bihar"
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-blue-700">
              Slug (editable)
            </Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(createSlug(e.target.value))}
              className="mt-2"
            />
            <div className="text-xs text-gray-400 mt-1">
              Used in URL: /cities/{slug || "city-slug"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-blue-700">
                Latitude
              </Label>
              <Input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-blue-700">
                Longitude
              </Label>
              <Input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* ===== SIDEBAR ===== */}
        <aside className="lg:col-span-1 space-y-4">
          {/* Status */}
          <div className="bg-white border rounded-md p-4 shadow-sm">
            <div className="text-sm font-medium text-blue-700 mb-2">
              Status
            </div>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Active</span>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 accent-blue-600"
              />
            </label>
          </div>

          {/* SEO */}
          <div className="bg-white border rounded-md p-4 shadow-sm space-y-3">
            <div className="text-sm font-medium text-blue-700">
              SEO
            </div>

            <div>
              <Label className="text-sm">Meta Title</Label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm">Meta Description</Label>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="mt-2"
              />
              <div className="text-xs text-gray-400 mt-1">
                {metaDescription.length}/160
              </div>
            </div>

            <div>
              <Label className="text-sm">Meta Keywords</Label>
              <Input
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="comma separated"
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm">Canonical URL</Label>
              <Input
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="mt-2"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={noIndex}
                onChange={(e) => setNoIndex(e.target.checked)}
                className="accent-blue-600"
              />
              No index
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save City"}
          </Button>
        </aside>
      </div>
    </form>
  );
}
