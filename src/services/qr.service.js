import QRCode from "qrcode";

export const generateQRCode = async (data) => {

  try {

    console.log("🟡 [QR] Generating QR code for entry:", data.entry_number);

    const qrBuffer = await QRCode.toBuffer(JSON.stringify(data), {
      type: "png",
      width: 500
    });

    console.log("🟢 [QR] QR code generated successfully");

    return qrBuffer;

  } catch (error) {

    console.log("🔴 [QR ERROR] Failed to generate QR code");
    console.log(error);

    throw error;
  }
};