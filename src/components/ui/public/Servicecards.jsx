import ServiceCard from "./ServiceProductCard";

export default function Servicecards({
  data = [],
  title = "Hot Deals",
  subtitle = "",
  citySlug,
}) {
  return (
    <section
      className="
        max-w-7xl
        mx-auto

        px-4
        sm:px-5
        md:px-6

        py-8
        sm:py-10
        md:py-12
      "
    >
      {/* HEADER */}
      <div
        className="
          mb-4
          sm:mb-5
          md:mb-6

          max-w-2xl
        "
      >
        <h2
          className="
            inline-block

            text-base
            sm:text-lg
            md:text-xl

            font-semibold
            leading-[1.25]

            text-gray-900

            border-b-4
            border-[#003459]

            pb-1.5
            sm:pb-2
          "
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="
              mt-1
              sm:mt-1.5

              text-xs
              sm:text-sm
              md:text-base

              leading-5
              md:leading-6

              text-gray-500
            "
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <div
          className="
            py-8
            sm:py-10

            text-xs
            sm:text-sm
            md:text-base

            leading-5
            md:leading-6

            text-gray-500
          "
        >
          No services available.
        </div>
      )}

      {/* SERVICES */}
      {data.length > 0 && (
        <>
          {/* MOBILE: HORIZONTAL SCROLL */}
          <div className="relative sm:hidden">
            {/* scroll hint */}
            <div
              className="
                pointer-events-none
                absolute
                right-0
                top-0
                z-10

                h-full
                w-10

                bg-gradient-to-l
                from-white
                to-transparent
              "
            />

            <div
              className="
                flex
                gap-3
                overflow-x-auto
                pb-2
                scrollbar-hide
              "
            >
              {data.slice(0, 8).map((service) => (
                <div
                  key={service._id}
                  className="min-w-[78%]"
                >
                  <ServiceCard
                    service={service}
                    citySlug={citySlug}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* DESKTOP GRID */}
          <div
            className="
              hidden
              sm:grid

              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4

              gap-4
              md:gap-5
              lg:gap-6
            "
          >
            {data.slice(0, 8).map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                citySlug={citySlug}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}