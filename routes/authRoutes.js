const express = require("express");
const router = express.Router();
const {
  registationValidation,
  verifyEmailOtpValidation,
  resendEmailOtpValidation,
  loginValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
} = require("../validators/authValidator");

const {
  registerUser,
  verifyEmail,
  resnedEmailOtp,
  loginUser,
  forgetPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  preAuthRateLimiter,
  userRateLimiter,
} = require("../middleware/rateLimit");




// register
router.post("/register", preAuthRateLimiter, registationValidation, registerUser);

// verify email
router.post("/verify-email",  preAuthRateLimiter,verifyEmailOtpValidation, verifyEmail); 

// resend otp
router.post("/resend-email-otp",  preAuthRateLimiter,resendEmailOtpValidation, resnedEmailOtp); 

// login
router.post("/login", preAuthRateLimiter, loginUser);

// forget password
router.post("/forget-password", preAuthRateLimiter,forgetPasswordValidation, forgetPassword);

// reset password
router.post("/reset-password", preAuthRateLimiter, resetPasswordValidation, resetPassword);


module.exports = router;
