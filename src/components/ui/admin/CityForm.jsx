"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSlug } from "@/utils/createSlug";
import { toast } from "sonner";

export default function CityForm({
  initialData = {},
  onSubmit,
}) {
  const [loading, setLoading] = useState(false);

  /* ---------- CORE ---------- */
  const [name, setName] = useState(initialData.name || "");
  const [state, setState] = useState(initialData.state || "");
  const [slug, setSlug] = useState(initialData.slug || "");

  /* ---------- SUB AREAS ---------- */
  const [subAreas, setSubAreas] = useState(
    initialData.subAreas || []
  );

  /* ---------- GEO ---------- */
  const [lat, setLat] = useState(initialData.geo?.lat || "");
  const [lng, setLng] = useState(initialData.geo?.lng || "");

  /* ---------- STATUS ---------- */
  const [isActive, setIsActive] = useState(
    initialData.isActive ?? true
  );

  /* ---------- SEO ---------- */
  const [metaTitle, setMetaTitle] = useState(
    initialData.seo?.metaTitle || ""
  );
  const [metaDescription, setMetaDescription] = useState(
    initialData.seo?.metaDescription || ""
  );
  const [metaKeywords, setMetaKeywords] = useState(
    (initialData.seo?.metaKeywords || []).join(", ")
  );
  const [canonicalUrl, setCanonicalUrl] = useState(
    initialData.seo?.canonicalUrl || ""
  );
  const [noIndex, setNoIndex] = useState(
    !!initialData.seo?.noIndex
  );

  /* ---------- FOOTER ---------- */
  const [address, setAddress] = useState(
    initialData.footer?.address || ""
  );
  const [phone, setPhone] = useState(
    initialData.footer?.phone || ""
  );
  const [alternatePhone, setAlternatePhone] = useState(
    initialData.footer?.alternatePhone || ""
  );
  const [email, setEmail] = useState(
    initialData.footer?.email || ""
  );
  const [whatsapp, setWhatsapp] = useState(
    initialData.footer?.whatsapp || ""
  );
  const [workingHours, setWorkingHours] = useState(
    initialData.footer?.workingHours || ""
  );
  const [supportText, setSupportText] = useState(
    initialData.footer?.supportText || ""
  );

  const [facebook, setFacebook] = useState(
    initialData.footer?.socialLinks?.facebook || ""
  );
  const [instagram, setInstagram] = useState(
    initialData.footer?.socialLinks?.instagram || ""
  );
  const [twitter, setTwitter] = useState(
    initialData.footer?.socialLinks?.twitter || ""
  );
  const [youtube, setYoutube] = useState(
    initialData.footer?.socialLinks?.youtube || ""
  );
  const [linkedin, setLinkedin] = useState(
    initialData.footer?.socialLinks?.linkedin || ""
  );

  /* ---------- AUTO SLUG ---------- */
  useEffect(() => {
    if (!initialData.slug) {
      setSlug(createSlug(name));
    }
  }, [name]);

  /* ---------- SUB AREA METHODS ---------- */
  function addSubArea() {
    setSubAreas([
      ...subAreas,
      {
        name: "",
        isActive: true,
        priority: 0,
      },
    ]);
  }

  function updateSubArea(index, field, value) {
    const copy = [...subAreas];
    copy[index][field] = value;
    setSubAreas(copy);
  }

  function removeSubArea(index) {
    setSubAreas(subAreas.filter((_, i) => i !== index));
  }

  /* ---------- SUBMIT ---------- */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("City name is required");
    }

    if (!state.trim()) {
      return toast.error("State is required");
    }

    const payload = {
      name: name.trim(),
      state: state.trim(),
      slug: slug || createSlug(name),
      isActive,
      subAreas,

      geo: {
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
      },

      seo: {
        metaTitle: metaTitle || name,
        metaDescription,
        metaKeywords: metaKeywords
          ? metaKeywords
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        canonicalUrl,
        noIndex,
      },

      footer: {
        address,
        phone,
        alternatePhone,
        email,
        whatsapp,
        workingHours,
        supportText,
        socialLinks: {
          facebook,
          instagram,
          twitter,
          youtube,
          linkedin,
        },
      },
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
    <form
      onSubmit={handleSubmit}
      
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN */}
        <div className="lg:col-span-2 space-y-6">
          {/* BASIC */}
          <div className="bg-white border rounded-md p-4 space-y-4">
            <h2 className="font-semibold text-blue-700">
              Basic Info
            </h2>

            <div>
              <Label>City Name</Label>
              <Input
                className="mt-2"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>

            <div>
              <Label>State</Label>
              <Input
                className="mt-2"
                value={state}
                onChange={(e) =>
                  setState(e.target.value)
                }
              />
            </div>

            <div>
              <Label>Slug</Label>
              <Input
                className="mt-2"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    createSlug(e.target.value)
                  )
                }
              />
            </div>
          </div>

          {/* SUB AREAS */}
          <div className="bg-white border rounded-md p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-blue-700">
                Sub Areas
              </h2>

              <Button
                type="button"
                variant="outline"
                onClick={addSubArea}
              >
                + Add Area
              </Button>
            </div>

            {subAreas.map((area, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2"
              >
                <Input
                  className="col-span-6"
                  placeholder="Area Name"
                  value={area.name}
                  onChange={(e) =>
                    updateSubArea(
                      i,
                      "name",
                      e.target.value
                    )
                  }
                />

                <Input
                  type="number"
                  className="col-span-3"
                  placeholder="Priority"
                  value={area.priority}
                  onChange={(e) =>
                    updateSubArea(
                      i,
                      "priority",
                      Number(e.target.value)
                    )
                  }
                />

                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={area.isActive}
                    onChange={(e) =>
                      updateSubArea(
                        i,
                        "isActive",
                        e.target.checked
                      )
                    }
                  />
                  <span className="text-sm">
                    Active
                  </span>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  className="col-span-1"
                  onClick={() =>
                    removeSubArea(i)
                  }
                >
                  ×
                </Button>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="bg-white border rounded-md p-4 space-y-4">
            <h2 className="font-semibold text-blue-700">
              Footer Contact Info
            </h2>

            <div>
              <Label>Address</Label>
              <Textarea
                rows={3}
                className="mt-2"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  className="mt-2"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Alternate Phone</Label>
                <Input
                  className="mt-2"
                  value={alternatePhone}
                  onChange={(e) =>
                    setAlternatePhone(
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  className="mt-2"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>WhatsApp</Label>
                <Input
                  className="mt-2"
                  value={whatsapp}
                  onChange={(e) =>
                    setWhatsapp(
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <Label>Working Hours</Label>
                <Input
                  className="mt-2"
                  value={workingHours}
                  onChange={(e) =>
                    setWorkingHours(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div>
              <Label>Support Text</Label>
              <Textarea
                rows={2}
                className="mt-2"
                value={supportText}
                onChange={(e) =>
                  setSupportText(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* SOCIAL */}
          <div className="bg-white border rounded-md p-4 space-y-4">
            <h2 className="font-semibold text-blue-700">
              Social Links
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Facebook URL"
                value={facebook}
                onChange={(e) =>
                  setFacebook(
                    e.target.value
                  )
                }
              />

              <Input
                placeholder="Instagram URL"
                value={instagram}
                onChange={(e) =>
                  setInstagram(
                    e.target.value
                  )
                }
              />

              <Input
                placeholder="Twitter URL"
                value={twitter}
                onChange={(e) =>
                  setTwitter(
                    e.target.value
                  )
                }
              />

              <Input
                placeholder="YouTube URL"
                value={youtube}
                onChange={(e) =>
                  setYoutube(
                    e.target.value
                  )
                }
              />

              <Input
                placeholder="LinkedIn URL"
                value={linkedin}
                onChange={(e) =>
                  setLinkedin(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* GEO */}
          <div className="bg-white border rounded-md p-4 space-y-4">
            <h2 className="font-semibold text-blue-700">
              Geo Location
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="any"
                  className="mt-2"
                  value={lat}
                  onChange={(e) =>
                    setLat(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="any"
                  className="mt-2"
                  value={lng}
                  onChange={(e) =>
                    setLng(e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <div className="bg-white border rounded-md p-4">
            <h2 className="font-semibold text-blue-700 mb-4">
              Status
            </h2>

            <label className="flex justify-between items-center">
              <span>Active</span>

              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(
                    e.target.checked
                  )
                }
              />
            </label>
          </div>

          <div className="bg-white border rounded-md p-4 space-y-4">
            <h2 className="font-semibold text-blue-700">
              SEO
            </h2>

            <div>
              <Label>Meta Title</Label>
              <Input
                className="mt-2"
                value={metaTitle}
                onChange={(e) =>
                  setMetaTitle(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <Label>
                Meta Description
              </Label>
              <Textarea
                rows={4}
                className="mt-2"
                value={metaDescription}
                onChange={(e) =>
                  setMetaDescription(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <Label>Keywords</Label>
              <Input
                className="mt-2"
                value={metaKeywords}
                onChange={(e) =>
                  setMetaKeywords(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <Label>Canonical URL</Label>
              <Input
                className="mt-2"
                value={canonicalUrl}
                onChange={(e) =>
                  setCanonicalUrl(
                    e.target.value
                  )
                }
              />
            </div>

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={noIndex}
                onChange={(e) =>
                  setNoIndex(
                    e.target.checked
                  )
                }
              />
              <span>No Index</span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading
              ? "Saving..."
              : "Save City"}
          </Button>
        </aside>
      </div>
    </form>
  );
}