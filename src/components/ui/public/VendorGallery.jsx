import Image from "next/image";

export default function VendorGallery({ images, vendor }) {
  return (
    <section>

      <h2 className="text-xl font-semibold mb-4">
        Gallery
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {images.map((img, i) => (
          <div
            key={i}
            className="relative h-40 rounded-lg overflow-hidden"
          >

            <Image
              src={img}
              alt={`${vendor.name} gallery`}
              fill
              sizes="(max-width:768px) 100vw, 33vw"
              className="object-contain"
            />

          </div>
        ))}

      </div>

    </section>
  );
}