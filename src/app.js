import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import healthcheckRouter from "./routes/healthcheck.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import eventRouter from "./routes/event.routes.js"
import entriesRouter from "./routes/entries.routes.js";
import paymentRouter from "./routes/payment.routes.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const baseUrl = "/api/v1";

app.use(`${baseUrl}/healthcheck`, healthcheckRouter);
app.use(`${baseUrl}/events`, eventRouter);
app.use(`${baseUrl}/entries`, entriesRouter);
app.use(`${baseUrl}/payments`, paymentRouter);

app.use(errorHandler);

export { app };