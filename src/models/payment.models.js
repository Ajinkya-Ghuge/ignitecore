import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    entry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entry",
      required: true
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    entry_number: {
      type: String
    },

    leader_name: String,
    leader_email: String,
    leader_phone: String,

    order_id: {
      type: String,
      required: true
    },

    cf_order_id: Number,

    payment_id: String,

    payment_session_id: String,

    amount: Number,

    currency: {
      type: String,
      default: "INR"
    },

    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    payment_method: String,

    gateway: {
      type: String,
      default: "cashfree"
    },

    raw_webhook: {
      type: Object
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;