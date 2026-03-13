import { v2 as cloudinary } from "cloudinary";

console.log("Cloudinary ENV Check:");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY);

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });


cloudinary.config({
  cloud_name: "dwmflxog1",
  api_key: "169923962759236",
  api_secret: "yP_VIcZ_Wjsw5F1eu0rj89dXUs0"
});

export default cloudinary;