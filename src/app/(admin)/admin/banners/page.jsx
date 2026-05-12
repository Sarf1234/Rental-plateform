"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
} from "lucide-react";

import BannerForm from "@/components/ui/admin/BannerForm";

import { apiRequest } from "@/lib/api";

export default function AdminBannerPage() {

  const [banners, setBanners] =
    useState([]);

  const [cities, setCities] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [editingBanner, setEditingBanner] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [placementFilter, setPlacementFilter] =
    useState("all");

  /* ---------------- FETCH ---------------- */

  async function fetchData() {

    try {

      setLoading(true);

      const [
        bannerRes,
        cityRes,
      ] = await Promise.all([
        apiRequest(
          "/api/admin/banners"
        ),

        apiRequest(
          "/api/cities?page=1&limit=100"
        ),
      ]);

      setBanners(
        bannerRes?.data || []
      );

      setCities(
        cityRes?.data || []
      );

    } catch (err) {

      toast.error(
        "Failed to fetch data"
      );

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- FILTERED DATA ---------------- */

  const filteredBanners =
    useMemo(() => {

      return banners.filter(
        (banner) => {

          const matchesSearch =
            banner.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesPlacement =
            placementFilter ===
              "all" ||
            banner.placement ===
              placementFilter;

          return (
            matchesSearch &&
            matchesPlacement
          );
        }
      );

    }, [
      banners,
      search,
      placementFilter,
    ]);

  /* ---------------- CREATE ---------------- */

  async function createBanner(
    payload
  ) {

    try {

      await apiRequest(
        "/api/admin/banners",
        "POST",
        payload
      );

      toast.success(
        "Banner created"
      );

      setDrawerOpen(false);

      fetchData();

    } catch {

      toast.error(
        "Create failed"
      );

    }
  }

  /* ---------------- UPDATE ---------------- */

  async function updateBanner(
    payload
  ) {

    try {

      await apiRequest(
        `/api/admin/banners/${editingBanner._id}`,
        "PUT",
        payload
      );

      toast.success(
        "Banner updated"
      );

      setEditingBanner(null);

      setDrawerOpen(false);

      fetchData();

    } catch {

      toast.error(
        "Update failed"
      );

    }
  }

  /* ---------------- DELETE ---------------- */

  async function deleteBanner(
    id
  ) {

    const confirmed =
      confirm(
        "Delete this banner?"
      );

    if (!confirmed) return;

    try {

      await apiRequest(
        `/api/admin/banners/${id}`,
        "DELETE"
      );

      toast.success(
        "Banner deleted"
      );

      fetchData();

    } catch {

      toast.error(
        "Delete failed"
      );

    }
  }

  /* ---------------- OPEN CREATE ---------------- */

  function openCreateDrawer() {

    setEditingBanner(null);

    setDrawerOpen(true);
  }

  /* ---------------- OPEN EDIT ---------------- */

  function openEditDrawer(
    banner
  ) {

    setEditingBanner(banner);

    setDrawerOpen(true);
  }

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Banner Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage homepage and city banners
          </p>

        </div>

        <button
          onClick={
            openCreateDrawer
          }
          className="h-11 px-5 rounded-lg bg-black text-white flex items-center gap-2"
        >

          <Plus size={18} />

          Create Banner

        </button>

      </div>

      {/* FILTERS */}

      <div className="bg-white border rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4">

        {/* SEARCH */}

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search banners..."
            className="w-full border rounded-lg h-11 pl-10 pr-4"
          />

        </div>

        {/* FILTER */}

        <select
          value={
            placementFilter
          }
          onChange={(e) =>
            setPlacementFilter(
              e.target.value
            )
          }
          className="border rounded-lg h-11 px-4"
        >

          <option value="all">
            All Placements
          </option>

          <option value="homepage">
            Homepage
          </option>

          <option value="citypage">
            Citypage
          </option>

          <option value="products">
            Products
          </option>

          <option value="services">
            Services
          </option>

          <option value="vendors">
            Vendors
          </option>

        </select>

      </div>

      {/* TABLE */}

      <div className="bg-white border rounded-2xl overflow-hidden">

        {loading ? (

          <div className="p-20 text-center text-gray-500">
            Loading banners...
          </div>

        ) : filteredBanners.length ===
          0 ? (

          <div className="p-20 text-center">

            <h3 className="text-xl font-semibold">
              No banners found
            </h3>

            <p className="text-gray-500 mt-2">
              Create your first banner
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left p-5 font-medium">
                    Banner
                  </th>

                  <th className="text-left p-5 font-medium">
                    Placement
                  </th>

                  <th className="text-left p-5 font-medium">
                    City
                  </th>

                  <th className="text-left p-5 font-medium">
                    Order
                  </th>

                  <th className="text-left p-5 font-medium">
                    Status
                  </th>

                  <th className="text-right p-5 font-medium">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredBanners.map(
                  (banner) => (
                    <tr
                      key={
                        banner._id
                      }
                      className="border-b hover:bg-gray-50 transition"
                    >

                      {/* BANNER */}

                      <td className="p-5">

                        <div className="flex items-center gap-4">

                          <img
                            src={
                              banner.desktopImage
                            }
                            alt=""
                            className="w-28 h-16 rounded-lg object-cover border"
                          />

                          <div>

                            <h3 className="font-semibold">
                              {
                                banner.title
                              }
                            </h3>

                            <p className="text-sm text-gray-500 line-clamp-1">
                              {
                                banner.subtitle
                              }
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PLACEMENT */}

                      <td className="p-5">

                        <span className="px-3 py-1 rounded-full bg-gray-100 text-sm capitalize">

                          {
                            banner.placement
                          }

                        </span>

                      </td>

                      {/* CITY */}

                      <td className="p-5">

                        {banner.city
                          ?.name ||
                          "Global"}

                      </td>

                      {/* ORDER */}

                      <td className="p-5">

                        {
                          banner.displayOrder
                        }

                      </td>

                      {/* STATUS */}

                      <td className="p-5">

                        {banner.isActive ? (
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            Inactive
                          </span>
                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="p-5">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            onClick={() =>
                              openEditDrawer(
                                banner
                              )
                            }
                            className="h-10 w-10 rounded-lg border flex items-center justify-center hover:bg-gray-100"
                          >

                            <Pencil size={16} />

                          </button>

                          <button
                            onClick={() =>
                              deleteBanner(
                                banner._id
                              )
                            }
                            className="h-10 w-10 rounded-lg border flex items-center justify-center hover:bg-red-50 text-red-600"
                          >

                            <Trash2 size={16} />

                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* DRAWER */}

      {drawerOpen && (

        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">

          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">

              <div>

                <h2 className="text-2xl font-semibold">

                  {editingBanner
                    ? "Edit Banner"
                    : "Create Banner"}

                </h2>

                <p className="text-gray-500 text-sm mt-1">

                  Manage your banner content

                </p>

              </div>

              <button
                onClick={() => {

                  setDrawerOpen(
                    false
                  );

                  setEditingBanner(
                    null
                  );
                }}
                className="h-10 w-10 rounded-lg border flex items-center justify-center"
              >

                <X size={18} />

              </button>

            </div>

            {/* FORM */}

            <div className="p-6">

              <BannerForm
                cities={cities}
                initialData={
                  editingBanner ||
                  {}
                }
                onSubmit={
                  editingBanner
                    ? updateBanner
                    : createBanner
                }
                buttonText={
                  editingBanner
                    ? "Update Banner"
                    : "Create Banner"
                }
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
}