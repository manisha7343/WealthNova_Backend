require("dotenv").config();

const multer = require("multer");
const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wealthNova_user_profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
  },

});

module.exports = storage;