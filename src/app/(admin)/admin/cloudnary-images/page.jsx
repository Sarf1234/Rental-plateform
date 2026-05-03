"use client";

import { useEffect, useState } from "react";

export default function ImageManager() {
  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(50);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => setImages(data));
  }, []);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);

    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDelete = async (public_id) => {
    const confirmDelete = confirm("Delete this image?");
    if (!confirmDelete) return;

    setLoadingDelete(public_id);

    await fetch("/api/images/delete-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id }),
    });

    setImages(images.filter((img) => img.public_id !== public_id));
    setLoadingDelete(null);
  };

  return (
    <div className="p-4">
      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.slice(0, visible).map((img) => (
          <div
            key={img.public_id}
            className="group relative rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition duration-300"
          >
            {/* IMAGE */}
            <div
              className="cursor-pointer relative"
              onClick={() => handleCopy(img.url, img.public_id)}
            >
              <img
                src={img.url}
                className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
              />

              {/* COPY OVERLAY */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition">
                {copiedId === img.public_id ? "Copied ✅" : "Click to Copy"}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between items-center px-2 py-2">
              <span className="text-xs text-gray-500 truncate">
                {img.public_id.split("/").pop()}
              </span>

              <button
                onClick={() => handleDelete(img.public_id)}
                disabled={loadingDelete === img.public_id}
                className="text-red-500 text-xs hover:text-red-700 transition"
              >
                {loadingDelete === img.public_id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* LOAD MORE */}
      {visible < images.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisible((prev) => prev + 50)}
            className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}