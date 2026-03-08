"use client";

import { useRef } from "react";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function ImageUploader({
  label,
  images = [],
  setImages,
  multiple = true,
}) {
  const fileInputRef = useRef(null);

  async function handleUpload(e) {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await apiRequest("/api/upload", "POST", fd);
      const url = res.data?.url || res.url;

      if (multiple) {
        setImages((prev) => [...prev, url]);
      } else {
        setImages([url]);
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Upload failed");
    }
  }

  function removeImage(url) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  function openFilePicker(e) {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  }

  return (
    <div className="space-y-4">

      <div className="text-sm font-medium text-indigo-700">
        {label}
      </div>

      {/* Upload Area */}

      <div
        onClick={openFilePicker}
        className="w-full flex items-center justify-center border border-dashed border-indigo-200 rounded-md p-6 bg-indigo-50 text-center cursor-pointer"
      >
        <div>
          <div className="text-indigo-600 font-medium">
            Upload Image
          </div>

          <div className="text-xs text-gray-500 mt-1">
            PNG / JPG / WEBP
          </div>
        </div>
      </div>

      {/* Hidden Input */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {/* Preview */}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {images.map((img) => (
            <div key={img} className="relative group">

              <img
                src={img}
                className="h-28 w-full object-cover rounded-md border"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeImage(img);
                }}
                className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
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