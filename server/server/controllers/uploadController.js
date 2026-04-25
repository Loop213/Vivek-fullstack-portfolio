const crypto = require("crypto");

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const maxDataUrlSize = 8 * 1024 * 1024;

function inferExtension(dataUrlHeader) {
  if (dataUrlHeader.includes("image/png")) return "png";
  if (dataUrlHeader.includes("image/webp")) return "webp";
  return "jpg";
}

async function uploadImage(req, res) {
  const { file, folder = "portfolio" } = req.body || {};

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({
      message: "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    });
  }

  if (!file || typeof file !== "string" || !file.startsWith("data:image/")) {
    return res.status(400).json({ message: "A valid image data URL is required." });
  }

  if (file.length > maxDataUrlSize) {
    return res.status(400).json({ message: "Image is too large. Please keep uploads under 5MB." });
  }

  const mimeMatch = file.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
  const mimeType = mimeMatch?.[1] || "";

  if (!allowedMimeTypes.includes(mimeType)) {
    return res.status(400).json({ message: "Only JPG, PNG, and WEBP images are supported." });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${inferExtension(file.slice(0, 40))}`;
  const signatureBase = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash("sha1").update(signatureBase).digest("hex");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", process.env.CLOUDINARY_API_KEY);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  });

  const payload = await response.json();

  if (!response.ok) {
    return res.status(502).json({
      message: payload?.error?.message || "Cloudinary upload failed."
    });
  }

  return res.status(201).json({
    imageUrl: payload.secure_url,
    publicId: payload.public_id
  });
}

module.exports = { uploadImage };
