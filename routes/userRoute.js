const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")// middleware
const {UpdateUserValdation} = require("../validators/userValidator")
const { 
    getProfile,  
    updateProfile,
    uploadProfilePic
} = require("../controllers/userContoller");

const {
  preAuthRateLimiter,
  userRateLimiter,
} = require("../middleware/rateLimit");

const uploadProfilePicMiddleware = require("../middleware/uploadMiddleware"); //mutler


// ########### get  profile #############################################
router.get("/profile", auth, userRateLimiter, getProfile)


// ######### update profile ###############
router.put("/profile", auth, UpdateUserValdation, updateProfile)

//########## multer upload route ##############
// NAYAA ROUTE YAHAN BANA DIYA
router.post("/upload-profile-pic", auth, userRateLimiter, uploadProfilePicMiddleware, uploadProfilePic);

module.exports = router;  