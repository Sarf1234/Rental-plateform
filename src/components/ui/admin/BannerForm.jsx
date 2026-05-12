"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { apiRequest } from "@/lib/api";

const placements = [
  "homepage",
  "citypage",
  "products",
  "services",
  "vendors",
  "service-category",
  "product-category",
];

const initialFormState = {
  title: "",
  subtitle: "",
  description: "",
  desktopImage: "",
  mobileImage: "",
  city: "",
  placement: "homepage",
  buttonText: "",
  buttonLink: "",
  displayOrder: 0,
  isActive: true,
};

export default function BannerForm({
  initialData = {},
  cities = [],
  onSubmit,
  buttonText = "Save Banner",
}) {

  const [loading, setLoading] =
    useState(false);

  const [uploadingDesktop, setUploadingDesktop] =
    useState(false);

  const [uploadingMobile, setUploadingMobile] =
    useState(false);

  const [formData, setFormData] =
    useState(initialFormState);

  /* -------------------------------- */
  /* EDIT MODE SYNC */
  /* -------------------------------- */

  useEffect(() => {

    if (
      initialData &&
      Object.keys(initialData).length > 0
    ) {

      setFormData({
        title:
          initialData.title || "",

        subtitle:
          initialData.subtitle || "",

        description:
          initialData.description || "",

        desktopImage:
          initialData.desktopImage || "",

        mobileImage:
          initialData.mobileImage || "",

        city:
          initialData.city?._id || "",

        placement:
          initialData.placement ||
          "homepage",

        buttonText:
          initialData.buttonText || "",

        buttonLink:
          initialData.buttonLink || "",

        displayOrder:
          initialData.displayOrder || 0,

        isActive:
          initialData.isActive ?? true,
      });

    } else {

      setFormData(initialFormState);

    }

  }, [initialData]);

  /* -------------------------------- */
  /* HELPERS */
  /* -------------------------------- */

  function updateField(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /* -------------------------------- */
  /* IMAGE UPLOAD */
  /* -------------------------------- */

  async function uploadImage(file) {

    const fd = new FormData();

    fd.append("image", file);

    const res = await apiRequest(
      "/api/upload",
      "POST",
      fd
    );

    return (
      res?.data?.url ||
      res?.url ||
      res?.secure_url
    );
  }

  async function handleDesktopUpload(e) {

    const file =
      e.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/")
    ) {
      return toast.error(
        "Only image files allowed"
      );
    }

    try {

      setUploadingDesktop(true);

      const url =
        await uploadImage(file);

      updateField(
        "desktopImage",
        url
      );

      toast.success(
        "Desktop image uploaded"
      );

    } catch (err) {

      toast.error(
        "Desktop upload failed"
      );

    } finally {

      setUploadingDesktop(false);

    }
  }

  async function handleMobileUpload(e) {

    const file =
      e.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/")
    ) {
      return toast.error(
        "Only image files allowed"
      );
    }

    try {

      setUploadingMobile(true);

      const url =
        await uploadImage(file);

      updateField(
        "mobileImage",
        url
      );

      toast.success(
        "Mobile image uploaded"
      );

    } catch (err) {

      toast.error(
        "Mobile upload failed"
      );

    } finally {

      setUploadingMobile(false);

    }
  }

  /* -------------------------------- */
  /* VALIDATION */
  /* -------------------------------- */

  function validateForm() {

    if (!formData.title.trim()) {
      toast.error(
        "Title is required"
      );
      return false;
    }

    if (
      !formData.desktopImage
    ) {
      toast.error(
        "Desktop image is required"
      );
      return false;
    }

    if (
      formData.desktopImage &&
      !isValidUrl(
        formData.desktopImage
      )
    ) {
      toast.error(
        "Invalid desktop image URL"
      );
      return false;
    }

    if (
      formData.mobileImage &&
      !isValidUrl(
        formData.mobileImage
      )
    ) {
      toast.error(
        "Invalid mobile image URL"
      );
      return false;
    }

    if (
      formData.buttonLink &&
      !formData.buttonLink.startsWith("/")
      &&
      !isValidUrl(
        formData.buttonLink
      )
    ) {
      toast.error(
        "Invalid button link"
      );
      return false;
    }

    return true;
  }

  /* -------------------------------- */
  /* SUBMIT */
  /* -------------------------------- */

  async function handleSubmit(e) {

    e.preventDefault();

    if (
      uploadingDesktop ||
      uploadingMobile
    ) {
      return toast.error(
        "Please wait for uploads to finish"
      );
    }

    const isValid =
      validateForm();

    if (!isValid) return;

    try {

      setLoading(true);

      const payload = {
        ...formData,
        title:
          formData.title.trim(),

        subtitle:
          formData.subtitle.trim(),

        description:
          formData.description.trim(),

        buttonText:
          formData.buttonText.trim(),

        buttonLink:
          formData.buttonLink.trim(),

        city:
          formData.city || null,
      };

      await onSubmit(payload);

      /* RESET ONLY ON CREATE */

      if (
        !initialData?._id
      ) {
        setFormData(
          initialFormState
        );
      }

    } catch (err) {

      toast.error(
        "Save failed"
      );

    } finally {

      setLoading(false);

    }
  }

  /* -------------------------------- */
  /* PREVENT ENTER SUBMIT */
  /* -------------------------------- */

  function handleKeyDown(e) {

    if (
      e.key === "Enter" &&
      e.target.tagName !==
        "TEXTAREA"
    ) {
      e.preventDefault();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="space-y-8"
    >

      {/* TITLE */}

      <div>

        <Label>
          Title *
        </Label>

        <Input
          value={formData.title}
          onChange={(e) =>
            updateField(
              "title",
              e.target.value
            )
          }
          placeholder="Banner title"
          className="mt-2"
        />

      </div>

      {/* SUBTITLE */}

      <div>

        <Label>
          Subtitle
        </Label>

        <Input
          value={
            formData.subtitle
          }
          onChange={(e) =>
            updateField(
              "subtitle",
              e.target.value
            )
          }
          placeholder="Banner subtitle"
          className="mt-2"
        />

      </div>

      {/* DESCRIPTION */}

      <div>

        <Label>
          Description
        </Label>

        <Textarea
          rows={4}
          value={
            formData.description
          }
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
          placeholder="Banner description"
          className="mt-2"
        />

      </div>

      {/* DESKTOP IMAGE */}

      <div>

        <Label>
          Desktop Image *
        </Label>

        <Input
          value={
            formData.desktopImage
          }
          onChange={(e) =>
            updateField(
              "desktopImage",
              e.target.value
            )
          }
          placeholder="Paste desktop image URL"
          className="mt-2"
        />

        <div className="mt-4">

          {formData.desktopImage ? (

            <div className="relative w-72">

              <img
                src={
                  formData.desktopImage
                }
                alt=""
                className="rounded-lg border object-cover"
              />

              <label className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded cursor-pointer">

                Replace

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleDesktopUpload
                  }
                  className="hidden"
                />

              </label>

            </div>

          ) : (

            <label className="border-2 border-dashed rounded-lg p-10 flex items-center justify-center cursor-pointer">

              <span>

                {uploadingDesktop
                  ? "Uploading..."
                  : "Upload Desktop Image"}

              </span>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleDesktopUpload
                }
                className="hidden"
              />

            </label>

          )}

        </div>

      </div>

      {/* MOBILE IMAGE */}

      <div>

        <Label>
          Mobile Image
        </Label>

        <Input
          value={
            formData.mobileImage
          }
          onChange={(e) =>
            updateField(
              "mobileImage",
              e.target.value
            )
          }
          placeholder="Paste mobile image URL"
          className="mt-2"
        />

        <div className="mt-4">

          {formData.mobileImage ? (

            <div className="relative w-40">

              <img
                src={
                  formData.mobileImage
                }
                alt=""
                className="rounded-lg border object-cover"
              />

              <label className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded cursor-pointer">

                Replace

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleMobileUpload
                  }
                  className="hidden"
                />

              </label>

            </div>

          ) : (

            <label className="border-2 border-dashed rounded-lg p-6 flex items-center justify-center cursor-pointer">

              <span>

                {uploadingMobile
                  ? "Uploading..."
                  : "Upload Mobile Image"}

              </span>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleMobileUpload
                }
                className="hidden"
              />

            </label>

          )}

        </div>

      </div>

      {/* CITY */}

      <div>

        <Label>
          City
        </Label>

        <select
          value={formData.city}
          onChange={(e) =>
            updateField(
              "city",
              e.target.value
            )
          }
          className="w-full border rounded-md h-10 px-3 mt-2"
        >

          <option value="">
            Global Banner
          </option>

          {cities.map((city) => (
            <option
              key={city._id}
              value={city._id}
            >
              {city.name}
            </option>
          ))}

        </select>

      </div>

      {/* PLACEMENT */}

      <div>

        <Label>
          Placement *
        </Label>

        <select
          value={
            formData.placement
          }
          onChange={(e) =>
            updateField(
              "placement",
              e.target.value
            )
          }
          className="w-full border rounded-md h-10 px-3 mt-2"
        >

          {placements.map((p) => (
            <option
              key={p}
              value={p}
            >
              {p}
            </option>
          ))}

        </select>

      </div>

      {/* BUTTON TEXT */}

      <div>

        <Label>
          Button Text
        </Label>

        <Input
          value={
            formData.buttonText
          }
          onChange={(e) =>
            updateField(
              "buttonText",
              e.target.value
            )
          }
          placeholder="Book Now"
          className="mt-2"
        />

      </div>

      {/* BUTTON LINK */}

      <div>

        <Label>
          Button Link
        </Label>

        <Input
          value={
            formData.buttonLink
          }
          onChange={(e) =>
            updateField(
              "buttonLink",
              e.target.value
            )
          }
          placeholder="/mumbai"
          className="mt-2"
        />

      </div>

      {/* DISPLAY ORDER */}

      <div>

        <Label>
          Display Order
        </Label>

        <Input
          type="number"
          min={0}
          value={
            formData.displayOrder
          }
          onChange={(e) =>
            updateField(
              "displayOrder",
              Number(
                e.target.value
              )
            )
          }
          className="mt-2"
        />

      </div>

      {/* ACTIVE */}

      <div className="flex items-center gap-3">

        <input
          type="checkbox"
          checked={
            formData.isActive
          }
          onChange={(e) =>
            updateField(
              "isActive",
              e.target.checked
            )
          }
        />

        <Label>
          Active Banner
        </Label>

      </div>

      {/* SUBMIT */}

      <Button
        type="submit"
        disabled={
          loading ||
          uploadingDesktop ||
          uploadingMobile
        }
        className="w-full"
      >

        {loading
          ? "Saving..."
          : buttonText}

      </Button>

    </form>
  );
}