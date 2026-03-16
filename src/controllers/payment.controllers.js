import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Entry from "../models/entries.models.js";
import Payment from "../models/payment.models.js";
import axios from "axios";
import { generateQRCode } from "../services/qr.service.js";
import { uploadQR } from "../services/upload.service.js";
import { sendTicketEmail } from "../services/email.service.js";
import crypto from "crypto";

const verifySignature = (payload, signature, secret) => {
  const generated = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64");

  return generated === signature;
};

const createPaymentOrder = asyncHandler(async (req, res) => {

  console.log("========== CASHFREE DEBUG ==========");

  console.log("APP_ID:", process.env.CASHFREE_APP_ID);
  console.log("SECRET:", process.env.CASHFREE_SECRET_KEY);
  console.log("ENV:", process.env.CASHFREE_ENV);

  const { entryId } = req.body;

  if (!entryId) {
    throw new ApiError(400, "Entry ID is required");
  }

  const entry = await Entry.findById(entryId).populate("event");

  if (!entry) {
    throw new ApiError(404, "Entry not found");
  }

  console.log("Entry Found:", entry._id);
  console.log("Event Amount:", entry.event.amount);

  const orderId = `order_${Date.now()}_${entry._id}`;

  const requestPayload = {
    order_id: orderId,
    order_amount: Number(entry.event.amount),
    order_currency: "INR",

    customer_details: {
      customer_id: entry.entry_number,
      customer_name: entry.leader_name,
      customer_email: entry.leader_email,
      customer_phone: entry.leader_phone
    },

    order_meta: {
      return_url: `https://ignitestudentassociation.in/payment-status?order_id=${orderId}`
    }
  };

  console.log("Request Payload:", requestPayload);

  try {

    const CASHFREE_URL =
    process.env.CASHFREE_ENV === "PRODUCTION"
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

    const response = await axios.post(
      CASHFREE_URL,
      requestPayload,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Cashfree Response:", response.data);

    entry.order_id = orderId;
    entry.payment_session_id = response.data.payment_session_id;
    await entry.save();

    return res.status(200).json(
      new ApiResponse(200, response.data, "Payment order created successfully")
    );

  } catch (error) {

    console.log("========== CASHFREE ERROR ==========");
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.log("Full Error:", error);

    throw new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || "Cashfree order creation failed"
    );
  }
});

const cashfreeWebhook = asyncHandler(async (req, res) => {

  console.log("========== CASHFREE WEBHOOK ==========");

  const order = req.body.data?.order;
  const payment = req.body.data?.payment;

  if (!order || !payment) {
    console.log("🔴 Invalid webhook payload");
    return res.status(400).json({ message: "Invalid webhook payload" });
  }

  const order_id = order.order_id;
  const payment_status = payment.payment_status;
  const cf_payment_id = payment.cf_payment_id;

  console.log("📦 Order ID:", order_id);
  console.log("💳 Payment Status:", payment_status);

  const entry = await Entry.findOne({ order_id }).populate("event");

  if (!entry) {
    console.log("🔴 Entry not found for order:", order_id);
    return res.status(404).json({ message: "Entry not found" });
  }

  /**
   * Prevent duplicate processing
   */

  const existingPayment = await Payment.findOne({ payment_id: cf_payment_id });

  if (existingPayment) {
    console.log("⚠️ Duplicate webhook detected. Skipping processing.");
    return res.status(200).json({ message: "Already processed" });
  }

  let status = "failed";

  if (payment_status === "SUCCESS") {

    console.log("🟢 Payment successful for entry:", entry.entry_number);

    status = "paid";

    entry.payment_status = "paid";
    entry.payment_id = cf_payment_id;

    await entry.save();

  } else {

    console.log("🔴 Payment failed");

    entry.payment_status = "failed";
    await entry.save();
  }

  console.log("🟡 Saving payment record...");

  const paymentRecord = await Payment.create({
    entry: entry._id,
    event: entry.event._id,
    entry_number: entry.entry_number,
    leader_name: entry.leader_name,
    leader_email: entry.leader_email,
    leader_phone: entry.leader_phone,
    order_id,
    payment_id: cf_payment_id,
    payment_status: status,
    raw_webhook: req.body
  });

  console.log("🟢 Payment stored:", paymentRecord._id);

  if (status === "paid") {

    /**
     * Prevent duplicate ticket generation
     */

    if (entry.qr_ticket) {
      console.log("⚠️ Ticket already generated. Skipping.");
      return res.status(200).json({ message: "Already processed" });
    }

    console.log("========== TICKET GENERATION ==========");

    const qrPayload = {
      entry_id: entry._id,
      entry_number: entry.entry_number,
      event: entry.event.title,
      participant: entry.leader_name
    };

    const qrBuffer = await generateQRCode(qrPayload);

    const qrUrl = await uploadQR(qrBuffer);

    entry.qr_ticket = qrUrl;
    await entry.save();

    console.log("🟢 Ticket URL saved in entry");

    await sendTicketEmail({
      email: entry.leader_email,
      name: entry.leader_name,
      event: entry.event,
      ticketUrl: qrUrl,
      entryNumber: entry.entry_number
    });

    console.log("🎉 Ticket pipeline completed for:", entry.entry_number);
  }

  console.log("========== WEBHOOK COMPLETED ==========");

  return res.status(200).json({
    message: "Webhook processed"
  });

});

export {
  createPaymentOrder,
  cashfreeWebhook
};