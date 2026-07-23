// middleware/uploadMiddleware.js
const multer = require('multer');
const storage = require('../config/multerConfig'); // 👈 Config se storage setting li

// Multer ko setting ke sath taiyar kiya
const upload = multer({ storage: storage });

// Frontend se 'profilePic' ke naam se aane wali ek single photo ko handle karne ka middleware
const uploadProfilePicMiddleware = upload.single('profilePic');

// Isko export kar diya taaki routes me use ho sake
module.exports = uploadProfilePicMiddleware;