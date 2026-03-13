import express from "express";
import {
  registerEntry,
  getAllEntries,
  getEntriesByEvent,
  getEntryById,
  checkinEntry,
  generateCertificate
} from "../controllers/entries.controllers.js";

const router = express.Router();

router.post("/register", registerEntry);
router.get("/", getAllEntries);
router.get("/event/:eventId", getEntriesByEvent);
router.get("/:entryId", getEntryById);
router.post("/checkin", checkinEntry);
router.post("/certificate/:entryId", generateCertificate);

export default router;