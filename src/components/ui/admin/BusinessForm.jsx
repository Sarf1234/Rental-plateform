"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createSlug } from "@/utils/createSlug";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

/* ---------- Chip ---------- */
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

/* ---------- MultiSelect Cities ---------- */
function CityMultiSelect({ value, onChange }) {
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await apiRequest("/api/cities?page=1&limit=200");
        setCities(res.data || []);
      } catch {
        toast.error("Failed to load cities");
      }
    }
    loadCities();
  }, []);

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(q.toLowerCase())
  );

  function toggle(id) {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  }

  return (
    <div className="relative" ref={ref}>
      <Label className="text-sm font-medium text-indigo-700 mb-1 block">
        Service Cities
      </Label>

      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full min-h-[44px] px-3 py-2 border rounded-md flex flex-wrap gap-2 text-left"
      >
        {value.length === 0 ? (
          <span className="text-sm text-gray-400">Select cities</span>
        ) : (
          value.map((id) => {
            const city = cities.find((c) => c._id === id);
            return (
              <Chip key={id} onRemove={() => toggle(id)}>
                {city?.name || id}
              </Chip>
            );
          })
        )}
        <span className="ml-auto text-xs text-indigo-500">
          {value.length}
        </span>
      </button>

      {open && (
        <div className="absolute z-40 left-0 right-0 mt-2 bg-white border rounded-md shadow max-h-56 overflow-auto p-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search city..."
            className="mb-2"
          />

          {filtered.map((city) => {
            const checked = value.includes(city._id);
            return (
              <label
                key={city._id}
                className="flex gap-2 px-2 py-2 hover:bg-indigo-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(city._id)}
                  className="accent-indigo-600"
                />
                <div>
                  <div className="text-sm font-medium text-indigo-700">
                    {city.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {city.state}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Business Form ---------- */
export default function BusinessForm({ initialData = {}, onSubmit }) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(initialData.name || "");
  const [slug, setSlug] = useState(initialData.slug || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [email, setEmail] = useState(initialData.email || "");

  const [address, setAddress] = useState(initialData.address || {});
  const [cities, setCities] = useState(
    (initialData.serviceAreas || []).map((c) => c._id || c)
  );

  const [isVerified, setIsVerified] = useState(
    !!initialData.isVerified
  );
  const [status, setStatus] = useState(
    initialData.status || "active"
  );

  useEffect(() => {
    if (!initialData.slug) {
      setSlug(createSlug(name));
    }
  }, [name]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return toast.error("Business name required");
    if (!phone.trim()) return toast.error("Phone required");
    if (!cities.length) return toast.error("Select at least one city");

    const payload = {
      name: name.trim(),
      slug,
      phone,
      email,
      address,
      serviceAreas: cities,
      isVerified,
      status,
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
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label>Business Name</Label>
            <Input value={name} onChange={(e)=>setName(e.target.value)} />
          </div>

          <div>
            <Label>Slug</Label>
            <Input value={slug} onChange={(e)=>setSlug(createSlug(e.target.value))} />
          </div>

          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={(e)=>setPhone(e.target.value)} />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>

          <CityMultiSelect value={cities} onChange={setCities} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Street"
              value={address.street || ""}
              onChange={(e)=>setAddress({...address, street: e.target.value})}
            />
            <Input
              placeholder="City"
              value={address.city || ""}
              onChange={(e)=>setAddress({...address, city: e.target.value})}
            />
            <Input
              placeholder="State"
              value={address.state || ""}
              onChange={(e)=>setAddress({...address, state: e.target.value})}
            />
            <Input
              placeholder="Pincode"
              value={address.pincode || ""}
              onChange={(e)=>setAddress({...address, pincode: e.target.value})}
            />
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <div className="bg-white border rounded-md p-4">
            <Label className="block mb-2">Verified</Label>
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(e)=>setIsVerified(e.target.checked)}
              className="accent-indigo-600"
            />
          </div>

          <div className="bg-white border rounded-md p-4">
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e)=>setStatus(e.target.value)}
              className="w-full border rounded-md mt-2 p-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-indigo-600" disabled={loading}>
            {loading ? "Saving..." : "Save Business"}
          </Button>
        </aside>
      </div>
    </form>
  );
}
