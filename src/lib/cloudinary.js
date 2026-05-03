import { v2 as cloudinary } from "cloudinary";
import path from "path";

// To prevent re-configuring Cloudinary on every request
let isConfigured = false;

export const configureCloudinary = () => {
  if (isConfigured) return;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  isConfigured = true;
};

// UPLOAD IMAGE
export async function uploadImage(filePath, folder = process.env.CLOUDINARY_FOLDER) {
  configureCloudinary();

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image");
  }
}

// DELETE IMAGE
export async function deleteImage(publicId) {
  configureCloudinary();

  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("Failed to delete image");
  }
}


export async function getAllImages(folder = process.env.CLOUDINARY_FOLDER) {
  configureCloudinary();

  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      // folder filter (optional)
      max_results: 100,
    });

    return result.resources.map((img) => ({
      url: img.secure_url,
      public_id: img.public_id,
      width: img.width,
      height: img.height,
      format: img.format,
      created_at: img.created_at,
    }));
  } catch (error) {
    console.error("Cloudinary Fetch Error:", error);
    throw new Error("Failed to fetch images");
  }
}