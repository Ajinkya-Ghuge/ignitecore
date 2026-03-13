import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: String,
    phone: String
  },
  { _id: false }
);

const entrySchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    entry_number: {
      type: String,
      unique: true
    },

    team_name: {
      type: String
    },

    team_size: {
      type: Number,
      default: 1
    },

    participants: [participantSchema],

    college_university: {
      type: String,
      required: true
    },

    leader_name: {
      type: String,
      required: true
    },

    leader_email: {
      type: String,
      required: true
    },

    leader_phone: {
      type: String,
      required: true
    },

    additional_info: String,

    payment_status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
    },

    order_id: String,

    payment_id: String,
    
    payment_session_id: String,

    amount_paid: Number,

    qr_code: String,

    qr_ticket: {
      type: String
    },

    checkin_status: {
      type: Boolean,
      default: false
    },

    certificate_generated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;