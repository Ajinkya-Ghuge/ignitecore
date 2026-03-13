import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./db/index.js";

console.log("Cloudinary ENV Check:");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY);

connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});