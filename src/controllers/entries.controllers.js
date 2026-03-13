import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Entry from "../models/entries.models.js";
import Event from "../models/event.models.js";
import mongoose from "mongoose";
import crypto from "crypto";
import e from "express";

const registerEntry = asyncHandler(async (req, res) => {

  const {
    event,
    team_name,
    team_size,
    participants,
    college_university,
    leader_name,
    leader_email,
    leader_phone,
    additional_info
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(event)) {
    throw new ApiError(400, "Invalid event id");
  }

  const eventExists = await Event.findById(event);

  if (!eventExists) {
    throw new ApiError(404, "Event not found");
  }

  const entryNumber = "ENT-" + crypto.randomBytes(4).toString("hex");

  const qrCodeData = `ENTRY:${entryNumber}`;

  const entry = await Entry.create({
    event,
    entry_number: entryNumber,
    team_name,
    team_size,
    participants,
    college_university,
    leader_name,
    leader_email,
    leader_phone,
    additional_info,
    qr_code: qrCodeData
  });

  await Event.findByIdAndUpdate(event, {
    $inc: { totalRegCount: 1 }
  });

  return res.status(201).json(
    new ApiResponse(201, entry, "Registration successful")
  );
});



const getAllEntries = asyncHandler(async (req, res) => {

  const entries = await Entry.find({})
    .populate("event")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, entries, "Entries fetched successfully")
  );
});



const getEntriesByEvent = asyncHandler(async (req, res) => {

  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event id");
  }

  const entries = await Entry.find({ event: eventId });

  return res.status(200).json(
    new ApiResponse(200, entries, "Event entries fetched")
  );
});




const getEntryById = asyncHandler(async (req, res) => {

  const { entryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(entryId)) {
    throw new ApiError(400, "Invalid entry id");
  }

  const entry = await Entry.findById(entryId).populate("event");

  if (!entry) {
    throw new ApiError(404, "Entry not found");
  }

  return res.status(200).json(
    new ApiResponse(200, entry, "Entry fetched successfully")
  );
});




const checkinEntry = asyncHandler(async (req, res) => {

  const { entry_number } = req.body;

  const entry = await Entry.findOne({ entry_number });

  if (!entry) {
    throw new ApiError(404, "Entry not found");
  }

  if (entry.checkin_status) {
    throw new ApiError(400, "Already checked in");
  }

  entry.checkin_status = true;

  await entry.save();

  return res.status(200).json(
    new ApiResponse(200, entry, "Check-in successful")
  );
});




const generateCertificate = asyncHandler(async (req, res) => {

  const { entryId } = req.params;

  const entry = await Entry.findById(entryId);

  if (!entry) {
    throw new ApiError(404, "Entry not found");
  }

  entry.certificate_generated = true;

  await entry.save();

  return res.status(200).json(
    new ApiResponse(200, entry, "Certificate generated")
  );
});



export {
  registerEntry,
  getAllEntries,
  getEntriesByEvent,
  getEntryById,
  checkinEntry,
  generateCertificate
};  