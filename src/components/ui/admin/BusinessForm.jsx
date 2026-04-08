"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSlug } from "@/utils/createSlug";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ---------------- CHIP ---------------- */

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm border">
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs"
        >
          ×
        </button>
      )}
    </span>
  );
}

/* ---------------- CITY SELECT ---------------- */

function CityMultiSelect({ value, onChange }) {
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    apiRequest("/api/cities?page=1&limit=200").then((r) =>
      setCities(r.data || []),
    );
  }, []);

  function toggle(id) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Label>Service Cities</Label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full min-h-[42px] border rounded-md px-3 py-2 flex flex-wrap gap-2"
      >
        {value.length === 0 && (
          <span className="text-gray-400 text-sm">
            Select cities where vendor provides services
          </span>
        )}

        {value.map((id) => {
          const city = cities.find((c) => c._id === id);
          return (
            <Chip key={id} onRemove={() => toggle(id)}>
              {city?.name}
            </Chip>
          );
        })}
      </button>

      {open && (
        <div className="absolute bg-white border mt-2 w-full rounded-md shadow p-2 max-h-60 overflow-auto">
          {cities.map((city) => (
            <label key={city._id} className="flex gap-2 py-2 px-2">
              <input
                type="checkbox"
                checked={value.includes(city._id)}
                onChange={() => toggle(city._id)}
              />
              {city.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================= */

export default function BusinessForm({ initialData = {}, onSubmit }) {
  const [loading, setLoading] = useState(false);

  /* BASIC */

  const [name, setName] = useState(initialData.name || "");
  const [slug, setSlug] = useState(initialData.slug || "");

  /* CONTACT */

  const [phone, setPhone] = useState(initialData.phone || "");
  const [email, setEmail] = useState(initialData.email || "");

  const [whatsappNumber, setWhatsappNumber] = useState(
    initialData.whatsappNumber || "",
  );
  const [contactPreference, setContactPreference] = useState(
    initialData.contactPreference || "both",
  );

  const [website, setWebsite] = useState(initialData.website || "");

  /* ADDRESS OBJECT */

  const [address, setAddress] = useState({
    street: initialData.address?.street || "",
    city: initialData.address?.city || "",
    state: initialData.address?.state || "",
    pincode: initialData.address?.pincode || "",
  });

  /* PROFILE */

  const [intro, setIntro] = useState(initialData.intro || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [experienceYears, setExperienceYears] = useState(
    initialData.experienceYears || 0,
  );

  /* MEDIA */

  const [logo, setLogo] = useState(initialData.logo || "");
  const [coverImage, setCoverImage] = useState(initialData.coverImage || "");

  const [gallery, setGallery] = useState(initialData.gallery || []);

  /* SERVICE AREAS */

  const [cities, setCities] = useState(
    (initialData.serviceAreas || []).map((c) => c._id || c),
  );

  /* PRODUCTS */

  const [products, setProducts] = useState(
    (initialData.products || []).map((p) => ({
      ...p,
      product: p.product?._id?.toString() || p.product?.toString() || "",
    })),
  );
  const [productList, setProductList] = useState([]);

  /* SERVICES */

  const [services, setServices] = useState(
    (initialData.services || []).map((s) => ({
      ...s,
      service: s.service?._id?.toString() || s.service?.toString() || "",
    })),
  );
  const [serviceList, setServiceList] = useState([]);

  /* STATS */

  const [ratingAvg, setRatingAvg] = useState(initialData.ratingAvg || 0);
  const [ratingCount, setRatingCount] = useState(initialData.ratingCount || 0);
  const [totalOrders, setTotalOrders] = useState(initialData.totalOrders || 0);

  /* FLAGS */

  const [isVerified, setIsVerified] = useState(!!initialData.isVerified);
  const [isFeatured, setIsFeatured] = useState(!!initialData.isFeatured);
  const [priority, setPriority] = useState(initialData.priority || 0);

  const [status, setStatus] = useState(initialData.status || "active");

  /* SEO */

  const [seo, setSeo] = useState({
    metaTitle: initialData.seo?.metaTitle || "",
    metaDescription: initialData.seo?.metaDescription || "",
    canonicalUrl: initialData.seo?.canonicalUrl || "",
    noIndex: initialData.seo?.noIndex || false,
  });

  /* AUTO SLUG */

  useEffect(() => {
    if (!initialData.slug) setSlug(createSlug(name));
  }, [name]);

  /* LOAD PRODUCTS + SERVICES */

  useEffect(() => {
    apiRequest("/api/products/admin?page=1&limit=100").then((r) =>
      setProductList(r.data || []),
    );

    apiRequest("/api/service/admin?page=1&limit=50").then((r) =>
      setServiceList(r.data || []),
    );
  }, []);

  /* PRODUCT BUILDER */

  function addProduct() {
    setProducts([
      ...products,
      {
        product: "",
        price: "",
        discountedPrice: "",
        securityDeposit: "",
        isAvailable: true,
        ratingAvg: 0,
        ratingCount: 0,
      },
    ]);
  }

  function updateProduct(i, key, value) {
    const copy = [...products];
    copy[i][key] = value;
    setProducts(copy);
  }

  function removeProduct(i) {
    setProducts(products.filter((_, idx) => idx !== i));
  }

  /* SERVICE BUILDER */

  function addService() {
    setServices([
      ...services,
      {
        service: "",
        price: "",
        isAvailable: true,
        ratingAvg: 0,
        ratingCount: 0,
      },
    ]);
  }

  function updateService(i, key, value) {
    const copy = [...services];
    copy[i][key] = value;
    setServices(copy);
  }

  function removeService(i) {
    setServices(services.filter((_, idx) => idx !== i));
  }

  /* ---------------- SUBMIT ---------------- */

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return toast.error("Business name required");
    if (!phone.trim()) return toast.error("Phone number required");

    const payload = {
      name,
      slug,

      phone,
      email,

      whatsappNumber,
      contactPreference,
      website,

      address,

      serviceAreas: cities,

      intro,
      description,
      experienceYears: Number(experienceYears),

      logo,
      coverImage,
      gallery,

      products: products.map((p) => ({
        product: p.product,
        price: Number(p.price),
        discountedPrice: Number(p.discountedPrice),
        securityDeposit: Number(p.securityDeposit),
        isAvailable: p.isAvailable,
        ratingAvg: Number(p.ratingAvg),
        ratingCount: Number(p.ratingCount),
      })),

      services: services.map((s) => ({
        service: s.service,
        price: Number(s.price),
        isAvailable: s.isAvailable,
        ratingAvg: Number(s.ratingAvg),
        ratingCount: Number(s.ratingCount),
      })),

      ratingAvg: Number(ratingAvg),
      ratingCount: Number(ratingCount),

      totalOrders: Number(totalOrders),

      isVerified,
      isFeatured,
      priority: Number(priority),

      seo,

      status,
    };

    try {
      setLoading(true);

      await onSubmit(payload);

      toast.success("Business saved successfully");
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* BASIC */}

      <div className="bg-white border rounded-md p-6 space-y-4">
        <Label>Business Name</Label>
        <Input
          placeholder="Example: Sharma Tent House"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Label>Slug</Label>
        <Input
          placeholder="auto-generated-business-slug"
          value={slug}
          onChange={(e) => setSlug(createSlug(e.target.value))}
        />
      </div>

      {/* CONTACT */}

      <div className="bg-white border rounded-md p-6 space-y-4">
        <Label>Phone</Label>
        <Input
          placeholder="Primary business phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Label>WhatsApp</Label>
        <Input
          placeholder="WhatsApp contact number"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
        />

        <Label>Email</Label>
        <Input
          placeholder="Business email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Label>Website</Label>
        <Input
          placeholder="https://example.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <Label>Contact Preference</Label>
        <select
          className="border rounded-md p-2"
          value={contactPreference}
          onChange={(e) => setContactPreference(e.target.value)}
        >
          <option value="call">Call</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="both">Call + WhatsApp</option>
        </select>
      </div>

      {/* ADDRESS */}

      <div className="bg-white border rounded-md p-6 space-y-4">
        <Label>Street Address</Label>
        <Input
          placeholder="House / Street / Area"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />

        <Label>City</Label>
        <Input
          placeholder="City name"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />

        <Label>State</Label>
        <Input
          placeholder="State name"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />

        <Label>Pincode</Label>
        <Input
          placeholder="Postal code"
          value={address.pincode}
          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
        />
      </div>

      {/* PROFILE */}

      <div className="bg-white border rounded-md p-6 space-y-4">
        <Label>Business Intro</Label>
        <Textarea
          placeholder="Short introduction about vendor"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
        />

        <Label>Full Description</Label>
        <JoditEditor value={description} onBlur={(v) => setDescription(v)} />

        <Label>Experience Years</Label>
        <Input
          placeholder="Example: 5"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
        />
      </div>

      {/* MEDIA */}

      <div className="bg-white border rounded-md p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUploader
          label="Business Logo"
          images={logo ? [logo] : []}
          setImages={(imgs) => setLogo(imgs[0] || "")}
          multiple={false}
        />

        <ImageUploader
          label="Cover Image"
          images={coverImage ? [coverImage] : []}
          setImages={(imgs) => setCoverImage(imgs[0] || "")}
          multiple={false}
        />

        <ImageUploader
          label="Gallery Images"
          images={gallery}
          setImages={setGallery}
          multiple={true}
        />
      </div>

      {/* SERVICE AREAS */}

      <div className="bg-white border rounded-md p-6">
        <CityMultiSelect value={cities} onChange={setCities} />
      </div>

      {/* PRODUCTS */}

      <div className="bg-white border rounded-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="font-medium">Products Offered</div>

          
        </div>

        {products.map((p, i) => (
          <div
            key={i}
            className="border rounded-md p-4 grid grid-cols-1 md:grid-cols-7 gap-4"
          >
            {/* PRODUCT */}

            <div className="space-y-1">
              <Label>Product</Label>

              <select
                value={p.product}
                onChange={(e) => updateProduct(i, "product", e.target.value)}
                className="border rounded-md p-2 w-full"
              >
                <option value="">Select product</option>

                {productList.map((pr) => {
                  const alreadySelected = products.some(
                    (prod, index) => prod.product === pr._id && index !== i,
                  );

                  return (
                    <option
                      key={pr._id}
                      value={pr._id}
                      disabled={alreadySelected}
                    >
                      {pr.title}-{pr?.pricing?.discountedPrice}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* PRICE */}

            <div className="space-y-1">
              <Label>Rental Price</Label>

              <Input
                type="number"
                placeholder="Example: 500"
                value={p.price}
                onChange={(e) => updateProduct(i, "price", e.target.value)}
              />
            </div>

            {/* DISCOUNT PRICE */}

            <div className="space-y-1">
              <Label>Discounted Price</Label>

              <Input
                type="number"
                placeholder="Example: 400"
                value={p.discountedPrice}
                onChange={(e) =>
                  updateProduct(i, "discountedPrice", e.target.value)
                }
              />
            </div>

            {/* SECURITY DEPOSIT */}

            <div className="space-y-1">
              <Label>Security Deposit</Label>

              <Input
                type="number"
                placeholder="Example: 1000"
                value={p.securityDeposit}
                onChange={(e) =>
                  updateProduct(i, "securityDeposit", e.target.value)
                }
              />
            </div>

            {/* RATING */}

            <div className="space-y-1">
              <Label>Average Rating</Label>

              <Input
                type="number"
                step="0.1"
                placeholder="0 - 5"
                value={p.ratingAvg}
                onChange={(e) => updateProduct(i, "ratingAvg", e.target.value)}
              />
            </div>

            {/* REVIEWS */}

            <div className="space-y-1">
              <Label>Total Reviews</Label>

              <Input
                type="number"
                placeholder="Example: 45"
                value={p.ratingCount}
                onChange={(e) =>
                  updateProduct(i, "ratingCount", e.target.value)
                }
              />
            </div>

            {/* AVAILABILITY */}

            <div className="flex items-center gap-3 mt-6">
              <input
                type="checkbox"
                checked={p.isAvailable}
                onChange={(e) =>
                  updateProduct(i, "isAvailable", e.target.checked)
                }
              />

              <span className="text-sm">Product Available</span>
            </div>

            {/* REMOVE */}

            <div className="flex items-center mt-5">
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeProduct(i)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" onClick={addProduct}>
            + Add Product
          </Button>
      </div>

      {/* SERVICES */}

      <div className="bg-white border rounded-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="font-medium">Services Offered</div>

          
        </div>

        {services.map((s, i) => (
          <div
            key={i}
            className="border rounded-md p-4 grid grid-cols-1 md:grid-cols-6 gap-4"
          >
            {/* SERVICE SELECT */}

            <div className="space-y-1">
              <Label>Service</Label>

              <select
                value={s.service}
                onChange={(e) => updateService(i, "service", e.target.value)}
                className="border rounded-md p-2 w-full"
              >
                <option value="">Select service</option>

                {serviceList.map((sv) => {
                  const alreadySelected = services.some(
                    (ser, index) => ser.service === sv._id && index !== i,
                  );

                  return (
                    <option
                      key={sv._id}
                      value={sv._id}
                      disabled={alreadySelected}
                    >
                      {sv.title} - {sv?.pricing?.amount}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* PRICE */}

            <div className="space-y-1">
              <Label>Service Price</Label>

              <Input
                type="number"
                placeholder="Example: 500"
                value={s.price}
                onChange={(e) => updateService(i, "price", e.target.value)}
              />
            </div>

            {/* RATING */}

            <div className="space-y-1">
              <Label>Average Rating</Label>

              <Input
                type="number"
                step="0.1"
                placeholder="0 - 5"
                value={s.ratingAvg}
                onChange={(e) => updateService(i, "ratingAvg", e.target.value)}
              />
            </div>

            {/* REVIEWS */}

            <div className="space-y-1">
              <Label>Total Reviews</Label>

              <Input
                type="number"
                placeholder="Example: 120"
                value={s.ratingCount}
                onChange={(e) =>
                  updateService(i, "ratingCount", e.target.value)
                }
              />
            </div>

            {/* AVAILABILITY */}

            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={s.isAvailable}
                onChange={(e) =>
                  updateService(i, "isAvailable", e.target.checked)
                }
              />

              <span className="text-sm">Service Available</span>
            </div>

            {/* REMOVE */}

            <div className="flex items-center mt-5">
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeService(i)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" onClick={addService}>
            + Add Service
        </Button>
      </div>

      {/* BUSINESS STATS */}

      <div className="bg-white border rounded-md p-6 space-y-4">
        <div className="font-medium text-lg">Business Statistics</div>

        <p className="text-sm text-gray-500">
          These stats represent overall vendor performance on the platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Vendor Rating Average</Label>

            <Input
              type="number"
              step="0.1"
              placeholder="Example: 4.5"
              value={ratingAvg}
              onChange={(e) => setRatingAvg(e.target.value)}
            />

            <p className="text-xs text-gray-500">
              Average rating across all products and services (0 - 5).
            </p>
          </div>

          <div className="space-y-1">
            <Label>Total Reviews</Label>

            <Input
              type="number"
              placeholder="Example: 120"
              value={ratingCount}
              onChange={(e) => setRatingCount(e.target.value)}
            />

            <p className="text-xs text-gray-500">
              Total number of customer reviews received.
            </p>
          </div>

          <div className="space-y-1">
            <Label>Total Orders Completed</Label>

            <Input
              type="number"
              placeholder="Example: 85"
              value={totalOrders}
              onChange={(e) => setTotalOrders(e.target.value)}
            />

            <p className="text-xs text-gray-500">
              Total number of orders fulfilled by this vendor.
            </p>
          </div>
        </div>
      </div>

      {/* FLAGS */}

      <div className="bg-white border rounded-md p-6 space-y-4">
        <div className="font-medium text-lg">Platform Settings</div>

        <p className="text-sm text-gray-500">
          Control vendor visibility and ranking on the platform.
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Verified Vendor</span>

          <input
            type="checkbox"
            checked={isVerified}
            onChange={(e) => setIsVerified(e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Featured Vendor</span>

          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        <div className="space-y-1">
          <Label>Priority Ranking</Label>

          <Input
            type="number"
            placeholder="Example: 10 (higher = higher ranking)"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />

          <p className="text-xs text-gray-500">
            Vendors with higher priority appear first in listings.
          </p>
        </div>
      </div>

      {/* SEO */}

      <div className="bg-white border rounded-md p-6 space-y-3">
        <Input
          placeholder="Meta Title (max 70 characters)"
          value={seo.metaTitle}
          onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
        />

        <Textarea
          placeholder="Meta Description (max 160 characters)"
          value={seo.metaDescription}
          onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
        />

        <Input
          placeholder="Canonical URL"
          value={seo.canonicalUrl}
          onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
        />

        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={seo.noIndex}
            onChange={(e) => setSeo({ ...seo, noIndex: e.target.checked })}
          />
          No Index Page
        </label>
      </div>

      {/* STATUS */}

      <div className="bg-white border rounded-md p-6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-md p-2 w-full"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-indigo-600">
        {loading ? "Saving..." : "Save Business"}
      </Button>
    </form>
  );
}
