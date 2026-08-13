const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")// middleware
const {
  UpdateUserValdation,
  ChangePasswordValidationRules

} = require("../validators/userValidator")
//---------------------- Controller ---------------------
const { 
    getProfile,  
    updateProfile,
    deleteAccount,
    changePassword,
    uploadProfilePic
} = require("../controllers/userContoller");

//----------------------- Rate limiting --------------------------
// const {
//   preAuthRateLimiter,
//   userRateLimiter,
// } = require("../middleware/rateLimit");

const uploadProfilePicMiddleware = require("../middleware/uploadMiddleware"); //mutler


// ########### get  profile #############################################
router.get(
  "/getProfile", 
  auth, 
  // userRateLimiter, 
  getProfile)


// ################# update profile ###############
router.put(
  "/updateProfile", 
  auth, 
  UpdateUserValdation,
  // userRateLimiter, 
  updateProfile)

// ################# Delete Account ###############
router.delete(
  "/deleteAccount", 
  auth, 
  // UpdateUserValdation, 
  deleteAccount
)

// ####### change password ##########################
router.put(
  "/changePassword", 
  auth,  
  ChangePasswordValidationRules,
  changePassword
)


//########## multer upload route ##############
// NAYAA ROUTE YAHAN BANA DIYA
router.put(
  "/uploadProfilePic",
  auth,
  uploadProfilePicMiddleware,
  uploadProfilePic
)


module.exports = router;  