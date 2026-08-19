"use client";

import { useState } from "react";

export default function AllProductFilters({
  filters,
  categories = [],
  loading = false,
  onChange,
  onApply,
  onClear,
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    tags: true,
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (key, value) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply();
    setMobileOpen(false);
  };

  return (
    <>
      {/* =========================================
          DESKTOP FILTER SIDEBAR
      ========================================= */}

      <aside className="hidden lg:block w-[250px] shrink-0">
        <div className="sticky top-24 rounded-lg border border-gray-200 bg-white">

          {/* FILTER HEADER */}

          <div className="flex items-center justify-between border-b px-5 py-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
              Filters
            </h3>

            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold uppercase text-[#003459] hover:underline"
            >
              Clear All
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 ">

            {/* CATEGORY */}

            <FilterSection
              title="Category"
              open={openSections.category}
              onToggle={() =>
                toggleSection("category")
              }
            >
              <div className="space-y-3 ">

                {categories.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    No categories available
                  </p>
                ) : (
                  categories.map((category) => (
                    <label
                      key={category._id}
                      className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={
                          filters.category ===
                          category.slug
                        }
                        onChange={() =>
                          update(
                            "category",
                            category.slug
                          )
                        }
                        className="h-4 w-4 accent-[#003459]"
                      />

                      <span>
                        {category.name}
                      </span>
                    </label>
                  ))
                )}

                {filters.category && (
                  <button
                    type="button"
                    onClick={() =>
                      update("category", "")
                    }
                    className="text-xs font-medium text-[#003459]"
                  >
                    Remove category
                  </button>
                )}

              </div>
            </FilterSection>


            {/* PRICE */}

            <FilterSection
              title="Price"
              open={openSections.price}
              onToggle={() =>
                toggleSection("price")
              }
            >
              <div className="space-y-4">

                <div className="grid grid-cols-2 gap-2">

                  <input
                    type="number"
                    min="0"
                    value={filters.min}
                    onChange={(e) =>
                      update(
                        "min",
                        e.target.value
                      )
                    }
                    placeholder="Min"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#003459]"
                  />

                  <input
                    type="number"
                    min="0"
                    value={filters.max}
                    onChange={(e) =>
                      update(
                        "max",
                        e.target.value
                      )
                    }
                    placeholder="Max"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#003459]"
                  />

                </div>

                {/* PRICE QUICK FILTERS */}

                <div className="space-y-2">

                  <PriceOption
                    label="Under ₹500"
                    active={
                      filters.max === "500" &&
                      filters.min === ""
                    }
                    onClick={() =>
                      onChange({
                        ...filters,
                        min: "",
                        max: "500",
                      })
                    }
                  />

                  <PriceOption
                    label="₹500 - ₹1,000"
                    active={
                      filters.min === "500" &&
                      filters.max === "1000"
                    }
                    onClick={() =>
                      onChange({
                        ...filters,
                        min: "500",
                        max: "1000",
                      })
                    }
                  />

                  <PriceOption
                    label="₹1,000 - ₹5,000"
                    active={
                      filters.min === "1000" &&
                      filters.max === "5000"
                    }
                    onClick={() =>
                      onChange({
                        ...filters,
                        min: "1000",
                        max: "5000",
                      })
                    }
                  />

                  <PriceOption
                    label="Above ₹5,000"
                    active={
                      filters.min === "5000" &&
                      filters.max === ""
                    }
                    onClick={() =>
                      onChange({
                        ...filters,
                        min: "5000",
                        max: "",
                      })
                    }
                  />

                </div>

              </div>
            </FilterSection>


            {/* TAGS */}

            <FilterSection
              title="Tags"
              open={openSections.tags}
              onToggle={() =>
                toggleSection("tags")
              }
            >

              <input
                type="text"
                value={filters.tags}
                onChange={(e) =>
                  update(
                    "tags",
                    e.target.value
                  )
                }
                placeholder="e.g. wedding, party"
                className="w-full rounded border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#003459]"
              />

              <p className="mt-2 text-[11px] text-gray-400">
                Separate multiple tags with commas
              </p>

            </FilterSection>


            {/* APPLY */}

            <div className="border-t p-4">

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-[#003459] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading
                  ? "Applying..."
                  : "Apply Filters"}
              </button>

            </div>

          </form>

        </div>
      </aside>


      {/* =========================================
          MOBILE FILTER BUTTON
      ========================================= */}

      <div className="lg:hidden mb-4">

        <div className="flex gap-2">

          <button
            type="button"
            onClick={() =>
              setMobileOpen(true)
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-800"
          >
            <span>☰</span>
            Filters
          </button>

          <select
            value={filters.sort}
            onChange={(e) =>
              update(
                "sort",
                e.target.value
              )
            }
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm font-semibold text-gray-800 outline-none"
          >
            <option value="newest">
              Sort: Newest
            </option>

            <option value="price_asc">
              Price: Low to High
            </option>

            <option value="price_desc">
              Price: High to Low
            </option>

            <option value="top">
              Most Rented
            </option>

            <option value="featured">
              Featured
            </option>
          </select>

        </div>

      </div>


      {/* =========================================
          MOBILE DRAWER
      ========================================= */}

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setMobileOpen(false)
            }
          />

          {/* DRAWER */}

          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white">

            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-4">

              <h3 className="font-bold text-gray-900">
                Filters
              </h3>

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="text-2xl text-gray-500"
              >
                ×
              </button>

            </div>

            <div className="p-5">

              {/* CATEGORY */}

              <FilterSection
                title="Category"
                open={openSections.category}
                onToggle={() =>
                  toggleSection("category")
                }
              >

                <div className="space-y-3">

                  {categories.map(
                    (category) => (
                      <label
                        key={category._id}
                        className="flex items-center gap-3 text-sm"
                      >
                        <input
                          type="radio"
                          name="mobile-category"
                          checked={
                            filters.category ===
                            category.slug
                          }
                          onChange={() =>
                            update(
                              "category",
                              category.slug
                            )
                          }
                          className="h-4 w-4 accent-[#003459]"
                        />

                        {category.name}
                      </label>
                    )
                  )}

                </div>

              </FilterSection>


              {/* PRICE */}

              <FilterSection
                title="Price"
                open={openSections.price}
                onToggle={() =>
                  toggleSection("price")
                }
              >

                <div className="grid grid-cols-2 gap-2">

                  <input
                    type="number"
                    value={filters.min}
                    onChange={(e) =>
                      update(
                        "min",
                        e.target.value
                      )
                    }
                    placeholder="Min"
                    className="rounded border px-3 py-3 text-sm"
                  />

                  <input
                    type="number"
                    value={filters.max}
                    onChange={(e) =>
                      update(
                        "max",
                        e.target.value
                      )
                    }
                    placeholder="Max"
                    className="rounded border px-3 py-3 text-sm"
                  />

                </div>

              </FilterSection>


              {/* TAGS */}

              <FilterSection
                title="Tags"
                open={openSections.tags}
                onToggle={() =>
                  toggleSection("tags")
                }
              >

                <input
                  type="text"
                  value={filters.tags}
                  onChange={(e) =>
                    update(
                      "tags",
                      e.target.value
                    )
                  }
                  placeholder="wedding, party"
                  className="w-full rounded border px-3 py-3 text-sm"
                />

              </FilterSection>

            </div>

            {/* MOBILE ACTION BAR */}

            <div className="sticky bottom-0 flex gap-3 border-t bg-white p-4">

              <button
                type="button"
                onClick={() => {
                  onClear();
                  setMobileOpen(false);
                }}
                className="flex-1 rounded-lg border py-3 text-sm font-semibold"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-lg bg-[#003459] py-3 text-sm font-semibold text-white"
              >
                {loading
                  ? "Applying..."
                  : "Apply Filters"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}


/* =========================================
   FILTER SECTION
========================================= */

function FilterSection({
  title,
  open,
  onToggle,
  children,
}) {
  return (
    <div className="border-b border-gray-200">

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left"
      >

        <span className="text-sm font-bold text-gray-900">
          {title}
        </span>

        <span className="text-gray-500">
          {open ? "−" : "+"}
        </span>

      </button>

      {open && (
        <div className="pb-5">
          {children}
        </div>
      )}

    </div>
  );
}


/* =========================================
   PRICE OPTION
========================================= */

function PriceOption({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 text-left text-sm ${
        active
          ? "font-semibold text-[#003459]"
          : "text-gray-600"
      }`}
    >

      <span
        className={`h-4 w-4 rounded-full border ${
          active
            ? "border-[#003459] bg-[#003459]"
            : "border-gray-400"
        }`}
      />

      {label}

    </button>
  );
}