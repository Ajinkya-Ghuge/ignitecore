import express from "express";
import { createPaymentOrder, cashfreeWebhook } from "../controllers/payment.controllers.js";

const router = express.Router();

router.post("/create-order", createPaymentOrder);
router.post("/cashfree-webhook", cashfreeWebhook);

export default router;