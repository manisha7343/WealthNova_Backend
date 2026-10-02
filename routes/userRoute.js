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
    uploadProfilePic,
    deleteProfilePic
} = require("../controllers/userContoller");

//----------------------- Rate limiting --------------------------
// const {
//   preAuthRateLimiter,
//   userRateLimiter,
// } = require("../middleware/rateLimit");

const uploadProfilePicMiddleware = require("../middleware/uploadMiddleware"); //mutler


// ########### get  profile #############################################
router.get("/getProfile", auth, getProfile);
router.get("/profile", auth, getProfile);

// ################# update profile ###############
router.put("/updateProfile", auth, UpdateUserValdation, updateProfile);
router.put("/profile", auth, UpdateUserValdation, updateProfile);

// ################# Delete Account ###############
router.delete("/deleteAccount", auth, deleteAccount);
router.delete("/deleteProfile", auth, deleteAccount);
router.delete("/profile", auth, deleteAccount);

// ####### change password ##########################
router.put(
  "/changePassword", 
  auth,  
  ChangePasswordValidationRules,
  changePassword
)


//########## multer upload route ##############
router.put(
  "/uploadProfilePic",
  auth,
  uploadProfilePicMiddleware,
  uploadProfilePic
)

//########## Delete/Remove Profile Picture ##############
router.delete(
  "/deleteProfilePic",
  auth,
  deleteProfilePic
)
router.delete(
  "/removeProfilePic",
  auth,
  deleteProfilePic
)


module.exports = router;  