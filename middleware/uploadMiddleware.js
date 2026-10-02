// middleware/uploadMiddleware.js
const multer = require('multer');
const storage = require('../config/multerConfig');

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uploadProfilePicMiddleware = (req, res, next) => {
  upload.single('profilePic')(req, res, (err) => {
    if (err) {
      console.error("Multer / Cloudinary upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to upload image. Allowed formats: JPG, PNG, WEBP (Max 5MB).",
      });
    }
    next();
  });
};

module.exports = uploadProfilePicMiddleware;