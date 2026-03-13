import { Router } from "express";

import {   createEvent,getAllEvents,getEventById,updateEvent,deleteEvent } from "../controllers/event.controllers.js";

const router = Router()

router.post("/create", createEvent);
router.get("/", getAllEvents);
router.get("/:eventid", getEventById);
router.patch("/:eventid", updateEvent);
router.delete("/:eventid", deleteEvent);



export default router