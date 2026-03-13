import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    
    content: {
      type: String,
      required: true
    },

    rules: {
      type: [String],
      default: []
    },

    tags: {
      type: [String],
      default: []
    },
        
    rulebook_url: String,

    amount: Number,

    mode: {
      type: String,
      enum: ["online", "offline"]
    },

    eventdate: {
      type: Date,
      required: true
    },

    eventtime: String,

    eventvenue: String,

    eventimage: String,

    whatsapp_group_url: String,

    eventCordinators : [
      {
        name: String,
        mobile: Number
      }
    ],


    totalRegCount: {
      type: Number,
      default: 0
    },

  },
  { timestamps: true } // auto creates createdAt & updatedAt
);

const Event = mongoose.model("Event", eventSchema);

export default Event;