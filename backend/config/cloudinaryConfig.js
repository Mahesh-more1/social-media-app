const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "social-media-app", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif", "mp4", "mov", "avi", "avif", "webm"],
    resource_type: "auto", // Auto-detect image or video
  },
});

module.exports = { cloudinary, storage };
