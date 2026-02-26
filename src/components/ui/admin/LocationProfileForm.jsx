"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/* =========================================================
   LOCATION PROFILE FORM
========================================================= */

export default function LocationProfileForm({
  initialData = {},
  onSubmit,
}) {
  const [loading, setLoading] = useState(false);

  /* CORE */
  const [city, setCity] = useState(initialData.city?._id || "");
  const [scope, setScope] = useState(initialData.scope || "city");

  const [product, setProduct] = useState(
    initialData.product?._id || ""
  );
  const [service, setService] = useState(
    initialData.service?._id || ""
  );
  const [productCategory, setProductCategory] = useState(
    initialData.productCategory?._id || ""
  );
  const [serviceCategory, setServiceCategory] = useState(
    initialData.serviceCategory?._id || ""
  );

  /* CONTEXT */
  const [priceMultiplier, setPriceMultiplier] = useState(
    initialData.priceMultiplier || 1
  );
  const [demandLevel, setDemandLevel] = useState(
    initialData.demandLevel || "medium"
  );
  const [customIntro, setCustomIntro] = useState(
    initialData.customIntro || ""
  );
  const [seasonalNote, setSeasonalNote] = useState(
    initialData.seasonalNote || ""
  );
  const [deliveryNote, setDeliveryNote] = useState(
    initialData.deliveryNote || ""
  );
  const [trendingText, setTrendingText] = useState(
    initialData.trendingText || ""
  );
  const [expressAvailable, setExpressAvailable] = useState(
    initialData.expressAvailable || false
  );

  /* SEO */
  const [seoTitleOverride, setSeoTitleOverride] = useState(
    initialData.seoTitleOverride || ""
  );
  const [seoDescriptionOverride, setSeoDescriptionOverride] =
    useState(initialData.seoDescriptionOverride || "");
  const [additionalContent, setAdditionalContent] = useState(
    initialData.additionalContent || ""
  );

  /* LIST DATA */
  const [allCities, setAllCities] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allProductCategories, setAllProductCategories] =
    useState([]);
  const [allServiceCategories, setAllServiceCategories] =
    useState([]);

  useEffect(() => {
    apiRequest("/api/cities").then((r) =>
      setAllCities(r.data || [])
    );
    apiRequest("/api/products?limit=500").then((r) =>
      setAllProducts(r.data || [])
    );
    apiRequest("/api/service/admin").then((r) =>
      setAllServices(r.data || [])
    );
    apiRequest("/api/products/categories").then((r) =>
      setAllProductCategories(r.data || [])
    );
    apiRequest("/api/service-categories").then((r) =>
      setAllServiceCategories(r.data || [])
    );
  }, []);

  /* RESET TARGETS WHEN SCOPE CHANGES */
 const [isInitialLoad, setIsInitialLoad] = useState(true);

useEffect(() => {
  if (isInitialLoad) {
    setIsInitialLoad(false);
    return;
  }

  setProduct("");
  setService("");
  setProductCategory("");
  setServiceCategory("");

}, [scope]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!city) {
      toast.error("City is required");
      return;
    }

    if (scope === "product" && !product) {
      toast.error("Select product");
      return;
    }

    if (scope === "service" && !service) {
      toast.error("Select service");
      return;
    }

    if (scope === "productCategory" && !productCategory) {
      toast.error("Select product category");
      return;
    }

    if (scope === "serviceCategory" && !serviceCategory) {
      toast.error("Select service category");
      return;
    }

    const payload = {
      city,
      scope,
      product: scope === "product" ? product : undefined,
      service: scope === "service" ? service : undefined,
      productCategory:
        scope === "productCategory" ? productCategory : undefined,
      serviceCategory:
        scope === "serviceCategory"
          ? serviceCategory
          : undefined,
      priceMultiplier: Number(priceMultiplier || 1),
      demandLevel,
      customIntro,
      seasonalNote,
      deliveryNote,
      trendingText,
      expressAvailable,
      seoTitleOverride,
      seoDescriptionOverride,
      additionalContent,
    };

    try {
      setLoading(true);
      await onSubmit(payload);
      toast.success("Location profile saved");
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  if (!initialData || !initialData._id) return;

  setCity(initialData.city?._id || "");
  setScope(initialData.scope || "city");

  setProduct(initialData.product?._id || "");
  setService(initialData.service?._id || "");
  setProductCategory(initialData.productCategory?._id || "");
  setServiceCategory(initialData.serviceCategory?._id || "");

  setPriceMultiplier(initialData.priceMultiplier || 1);
  setDemandLevel(initialData.demandLevel || "medium");
  setCustomIntro(initialData.customIntro || "");
  setSeasonalNote(initialData.seasonalNote || "");
  setDeliveryNote(initialData.deliveryNote || "");
  setTrendingText(initialData.trendingText || "");
  setExpressAvailable(initialData.expressAvailable || false);

  setSeoTitleOverride(initialData.seoTitleOverride || "");
  setSeoDescriptionOverride(initialData.seoDescriptionOverride || "");
  setAdditionalContent(initialData.additionalContent || "");

}, [initialData]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-4 space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="bg-white p-4 border rounded-md space-y-3">
            <Label>City *</Label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select city</option>
              {allCities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <Label>Scope *</Label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="city">City</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
              <option value="productCategory">
                Product Category
              </option>
              <option value="serviceCategory">
                Service Category
              </option>
            </select>

            {/* Dynamic Target */}
            {scope === "product" && (
              <select
                value={product}
                onChange={(e) =>
                  setProduct(e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select product</option>
                {allProducts.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            )}

            {scope === "service" && (
              <select
                value={service}
                onChange={(e) =>
                  setService(e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select service</option>
                {allServices.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title}
                  </option>
                ))}
              </select>
            )}

            {scope === "productCategory" && (
              <select
                value={productCategory}
                onChange={(e) =>
                  setProductCategory(e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select product category</option>
                {allProductCategories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            {scope === "serviceCategory" && (
              <select
                value={serviceCategory}
                onChange={(e) =>
                  setServiceCategory(e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select service category</option>
                {allServiceCategories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* CONTEXT */}
          <div className="bg-white p-4 border rounded-md space-y-3">
            <Label>Price Multiplier</Label>
            <Input
              type="number"
              step="0.1"
              value={priceMultiplier}
              onChange={(e) =>
                setPriceMultiplier(e.target.value)
              }
            />

            <Label>Demand Level</Label>
            <select
              value={demandLevel}
              onChange={(e) =>
                setDemandLevel(e.target.value)
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <Textarea
              placeholder="Custom Intro"
              value={customIntro}
              onChange={(e) =>
                setCustomIntro(e.target.value)
              }
            />

            <Textarea
              placeholder="Seasonal Note"
              value={seasonalNote}
              onChange={(e) =>
                setSeasonalNote(e.target.value)
              }
            />

            <Textarea
              placeholder="Delivery Note"
              value={deliveryNote}
              onChange={(e) =>
                setDeliveryNote(e.target.value)
              }
            />

            <Textarea
              placeholder="Trending Text"
              value={trendingText}
              onChange={(e) =>
                setTrendingText(e.target.value)
              }
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={expressAvailable}
                onChange={() =>
                  setExpressAvailable(!expressAvailable)
                }
              />
              Express Available
            </label>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white p-4 border rounded-md space-y-3">
            <Label>SEO Title Override</Label>
            <Input
              value={seoTitleOverride}
              onChange={(e) =>
                setSeoTitleOverride(e.target.value)
              }
            />

            <Label>SEO Description Override</Label>
            <Textarea
              value={seoDescriptionOverride}
              onChange={(e) =>
                setSeoDescriptionOverride(
                  e.target.value
                )
              }
            />

            <Label>Additional Content</Label>
            <Textarea
              rows={6}
              value={additionalContent}
              onChange={(e) =>
                setAdditionalContent(e.target.value)
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Location Profile"}
          </Button>
        </div>
      </div>
    </form>
  );
}