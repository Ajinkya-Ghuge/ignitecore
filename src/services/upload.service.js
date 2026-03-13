import cloudinary from "../config/cloudinary.js";

export const uploadQR = async (buffer) => {

  try {

    console.log("🟡 [UPLOAD] Preparing QR for Cloudinary upload...");

    const base64Image = `data:image/png;base64,${buffer.toString("base64")}`;

    console.log("🟡 [UPLOAD] Uploading QR ticket to Cloudinary...");

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "event_tickets"
    });

    console.log("🟢 [UPLOAD SUCCESS] QR uploaded successfully");
    console.log("📎 Public ID:", result.public_id);
    console.log("🌐 QR URL:", result.secure_url);

    return result.secure_url;

  } catch (error) {

    console.log("🔴 [UPLOAD ERROR] Cloudinary upload failed");
    console.log(error);

    throw error;
  }
};