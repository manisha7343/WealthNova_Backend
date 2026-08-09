const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")// middleware
const {UpdateUserValdation} = require("../validators/userValidator")
//---------------------- Controller ---------------------
const { 
    getProfile,  
    updateProfile,
    deleteAccount
    // uploadProfilePic
} = require("../controllers/userContoller");

//----------------------- Rate limiting --------------------------
// const {
//   preAuthRateLimiter,
//   userRateLimiter,
// } = require("../middleware/rateLimit");

// const uploadProfilePicMiddleware = require("../middleware/uploadMiddleware"); //mutler


// ########### get  profile #############################################
router.get(
  "/getProfile", 
  auth, 
  // userRateLimiter, 
  getProfile)


// ######### update profile ###############
router.put(
  "/updateProfile", 
  auth, 
  UpdateUserValdation, 
  updateProfile)

  // ################# Delete Account ###############
router.delete(
  "/deleteAccount", 
  auth, 
  // UpdateUserValdation, 
  deleteAccount
)

// ####### change password ##########################
// router.put("/change-password", auth,  changePassword)


//########## multer upload route ##############
// NAYAA ROUTE YAHAN BANA DIYA
// router.post("/upload-profile-pic", auth, userRateLimiter, uploadProfilePicMiddleware, uploadProfilePic);

module.exports = router;  