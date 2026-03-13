import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Event from "../models/event.models.js";
import mongoose from "mongoose";


// CREATE EVENT
const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    rules,
    tags,
    amount,
    mode,
    eventdate,
    eventtime,
    eventvenue,
    eventimage,
    whatsapp_group_url
  } = req.body;

  if ([title, content, eventdate].some(field => !field || field.toString().trim() === "")) {
    throw new ApiError(400, "Missing required fields");
  }

  const rulesArray = Array.isArray(rules) ? rules : [];

  const event = await Event.create({
    title,
    content,
    rules: rulesArray,
    tags,
    amount,
    mode,
    eventdate,
    eventtime,
    eventvenue,
    eventimage,
    whatsapp_group_url
  });

    return res.status(201).json(
      new ApiResponse(201, event, "Event created successfully")
    );
  });



// GET ALL EVENTS
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ eventdate: 1 });

  return res.status(200).json(
    new ApiResponse(200, events, "Events retrieved successfully")
  );
});



// GET EVENT BY ID
const getEventById = asyncHandler(async (req, res) => {
  const { eventid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventid)) {
    throw new ApiError(400, "Invalid event id");
  }

  const event = await Event.findById(eventid);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res.status(200).json(
    new ApiResponse(200, event, "Event fetched successfully")
  );
});



// UPDATE EVENT
const updateEvent = asyncHandler(async (req, res) => {
  const { eventid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventid)) {
    throw new ApiError(400, "Invalid event id");
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    eventid,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedEvent) {
    throw new ApiError(404, "Event not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedEvent, "Event updated successfully")
  );
});



// DELETE EVENT
const deleteEvent = asyncHandler(async (req, res) => {
  const { eventid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventid)) {
    throw new ApiError(400, "Invalid event id");
  }

  const event = await Event.findByIdAndDelete(eventid);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Event deleted successfully")
  );
});



export {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};