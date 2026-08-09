const express = require("express");
const router = express.Router();
//----------------------- validators ------------------------
const {
  registationValidation,
  loginValidation,
} = require("../validators/authValidator");

//----------------------- controllers ---------------------------------
const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

//----------------------- Rate limiting --------------------------
//Rate limiting middlware 
// const {
//   preAuthRateLimiter,
//   userRateLimiter,
// } = require("../middleware/rateLimit");

// register
router.post
(
  "/register", 
  // preAuthRateLimiter, 
  registationValidation, 
  registerUser
);

// -------------------------- login -----------------------------------------
router.post
(
  "/login", 
  // preAuthRateLimiter,
  loginValidation, 
  loginUser
);


// --------------------------- OAuth 🔴--------------------------
// router.post("/OAuth", OAuth);

module.exports = router;
