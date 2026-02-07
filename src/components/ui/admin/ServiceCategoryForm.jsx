"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createSlug } from "@/utils/createSlug";
import { apiRequest } from "@/lib/api";

export default function ServiceCategoryForm({
  initialData = {},
  onSubmit,
  buttonText = "Save Category",
}) {
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const [name, setName] = useState(initialData.name || "");
  const [slug, setSlug] = useState(initialData.slug || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [images, setImages] = useState(initialData.images || []);
  const [isActive, setIsActive] = useState(initialData.isActive ?? true);

  const [metaTitle, setMetaTitle] = useState(initialData?.seo?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.seo?.metaDescription || "");
  const [metaKeywords, setMetaKeywords] = useState(
    (initialData?.seo?.metaKeywords || []).join(", ")
  );

  useEffect(() => {
    if (!initialData.slug) {
      setSlug(createSlug(name));
    }
  }, [name]);

  async function handleUpload(file) {
    const fd = new FormData();
    fd.append("image", file);

    const res = await apiRequest("/api/upload", "POST", fd);
    return res.data?.url || res.url || res.secure_url || res.data;
  }

  async function handleAddImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/"))
      return toast.error("Only images allowed");

    if (images.length >= 4)
      return toast.error("Maximum 4 images allowed");

    try {
      setUploadingIndex(images.length);
      const url = await handleUpload(file);
      setImages([...images, url]);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingIndex(null);
    }
  }

  async function handleReplaceImage(e, index) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIndex(index);
      const url = await handleUpload(file);
      const updated = [...images];
      updated[index] = url;
      setImages(updated);
      toast.success("Image replaced");
    } catch {
      toast.error("Replace failed");
    } finally {
      setUploadingIndex(null);
    }
  }

  function removeImage(index) {
    if (!confirm("Remove this image?")) return;
    setImages(images.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name required");
    if (!slug.trim()) return toast.error("Slug required");

    if (images.length > 4)
      return toast.error("Maximum 4 images allowed");

    const payload = {
      name: name.trim(),
      slug,
      description,
      images,
      isActive,
      seo: {
        metaTitle: metaTitle || name,
        metaDescription: metaDescription || description,
        metaKeywords: metaKeywords
          ? metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
          : [],
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
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Service category name"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(createSlug(e.target.value))}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          {/* IMAGES */}
          <div>
            <div className="flex justify-between items-center">
              <Label>Category Images</Label>
              <span className="text-xs text-gray-400">
                {images.length}/4 uploaded
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">

              {images.map((img, i) => (
                <div key={i} className="relative group">

                  <img
                    src={img}
                    alt=""
                    className="w-full h-32 object-cover rounded-md border"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-md">

                    <label className="bg-white text-xs px-2 py-1 rounded cursor-pointer">
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleReplaceImage(e, i)}
                        className="sr-only"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="bg-red-600 text-white text-xs px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>

                  {uploadingIndex === i && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-medium">
                      Uploading...
                    </div>
                  )}
                </div>
              ))}

              {images.length < 4 && (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-32 cursor-pointer hover:border-indigo-500 transition">
                  <span className="text-sm text-gray-500">+ Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddImage}
                    className="sr-only"
                  />
                </label>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <aside className="space-y-6">

          <div className="bg-white border rounded-md p-4 shadow-sm">
            <Label>Active</Label>
            <div className="mt-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 accent-indigo-600"
              />
            </div>
          </div>

          <div className="bg-white border rounded-md p-4 shadow-sm space-y-4">
            <div className="font-medium text-sm">SEO Settings</div>

            <div>
              <Label>Meta Title</Label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Meta Description</Label>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Meta Keywords</Label>
              <Input
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="comma separated"
                className="mt-2"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Saving..." : buttonText}
          </Button>

        </aside>
      </div>
    </form>
  );
}
