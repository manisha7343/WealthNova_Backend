// config/multerConfig.js
const { config } = require('dotenv');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// 1. Cloudinary ko apne credentials batayein
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cloudinary Storage ka setup banayein
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profiles', // Cloudinary par is naam ka folder ban jayega
    allowed_formats: ['jpg', 'png', 'jpeg'], // Sirf yahi formats allow honge
  },
});

// Isko export kar rahe hain
module.exports = storage;