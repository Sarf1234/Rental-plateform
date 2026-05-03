"use client";

import { useEffect, useRef, useState } from "react";

export default function ImageManager() {
  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(50);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fileRef = useRef(null);

  // LOAD IMAGES
  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then(setImages);
  }, []);

  // COPY
  const copy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  // DELETE
  const remove = async (id) => {
    if (!confirm("Delete image?")) return;

    setLoadingDelete(id);

    await fetch("/api/images/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id: id }),
    });

    setImages((prev) => prev.filter((i) => i.public_id !== id));
    setLoadingDelete(null);
  };

  // 🔥 UPLOAD (same as product)
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (data.url) {
      setImages((prev) => [
        { url: data.url, public_id: data.public_id || Date.now() },
        ...prev, // 🔥 newest on top
      ]);
    }
  };

  return (
    <div className="p-4 space-y-4">

      {/* 🔥 UPLOAD BUTTON */}
      <div>
        <button
          onClick={() => fileRef.current.click()}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          Upload Image
        </button>

        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={upload}
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.slice(0, visible).map((img) => (
          <div
            key={img.public_id}
            className="group relative rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition"
          >
            <div className="relative">
  <div
    className="cursor-pointer"
    onClick={() => copy(img.url, img.public_id)}
  >
    <img
      src={img.url}
      className="w-full h-40 object-cover group-hover:scale-105 transition"
    />
  </div>

  {/* 🔥 OVERLAY (ONLY ON IMAGE) */}
  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm pointer-events-none">
    {copiedId === img.public_id ? "Copied ✅" : "Click to Copy"}
  </div>
</div>

            <div className="flex justify-between px-2 py-2 text-xs">
              <span className="truncate">
                {img.public_id?.split("/").pop()}
              </span>

              <button
                onClick={() => remove(img.public_id)}
                className="relative z-10 text-red-500 cursor-pointer"
              >
                {loadingDelete === img.public_id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* LOAD MORE */}
      {visible < images.length && (
        <div className="text-center">
          <button
            onClick={() => setVisible((v) => v + 50)}
            className="px-5 py-2 bg-black text-white rounded-md"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}