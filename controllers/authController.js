// authController - register, login, profile
const User = require("../model/user");
const sendEmail = require("../utils/Email_utile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require('dotenv').config()

const redis = require("../config/redis")

// #######################   register user  ######################

//OK
const registerUser = async (req, res) => {
  try {

    let { first_name, last_name, email, password } = req.body;


    //2. check user already exits ?
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id) {
      return res.status(409).json({
        success: false,
        message: "user already exits",
      });
    }

    // 3. passward hashing
    const hashedpassword = await bcrypt.hash(password, 10);


    // 4. create user
    const result = await User.create({
      first_name: first_name,
      last_name: last_name,
      email:email,
      password: hashedpassword,
    });

    console.log(result);
    
  //------------ otp for email verifiction ----------------

    //generating OTP

    const OTP = crypto.randomInt(100000, 999999);

    const expiry = Date.now() + 2 * 60 * 1000;

    const hashedOTP = await bcrypt.hash(OTP.toString(), 10);

    // DB save
      result.verifyEmailOtp = hashedOTP;
      result.verifyEmailOtpExpiry = expiry;
      await result.save();
    
              //send email ------------------
              try {
                await sendEmail(
                  email,
                  "otp for verification",
                  `<p>Your OTP is <b>${OTP}</b></p>`,
                )
                console.log("email sent successfully to verify-Email",email);
                

              } catch (err) {
                //email not exitsts in world delete form DB
                console.log("Email send failed: ", err.message);

                if (result && result._id) {
                  await User.findByIdAndDelete(result._id);
                }

                return res.status(500).json({
                  success: false,
                  message: "Failed to send verification email. Please try later",
                });
              }

              //-------------------------------------------

    return res.status(201).json({
      success: true,
      message: "registered successfully! please verify your email",
    });
  } catch (error) {
    console.log("Error in register User : ", error);

    res.status(500).json({
      success: false,
      message: "something went wrong/Error",
    });
  }
};

// ###################  verify email otp  ##############################
// OK
const verifyEmail = async (req, res) => {
  //verify-email

  try {
    let { email, otp } = req.body;
    
    // user existance in DB
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //user already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified!",
      });
    }
    

    if (!user.verifyEmailOtp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one",
      });
    }

    // check email OTP expiry
    if (!user.verifyEmailOtpExpiry || user.verifyEmailOtpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Your verification OTP has expired",
      });
    }

    // otp match
    const isMatch = await bcrypt.compare(otp.toString(), user.verifyEmailOtp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid otp",
      });
    }

    // clear DB values
    user.isEmailVerified = true;
    user.verifyEmailOtp = null;
    user.verifyEmailOtpExpiry = null;
    await user.save();

    //response to user
    console.log("email verified succcessfully");

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can login now",
    });
  } catch (error) {
    console.log("Error in verifying Email: ", error);

    return res.status(500).json({
      success: false,
      message: "failed to verify your email",
    });
  }
};

//############################# resend email otp #############
// WORKKKKK
const resnedEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    //email check - DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "if email exist, otp will sent",
      });
    }

    //already verify check
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is verified",
      });
    }

    // alreay sent check------ (10-8 < 6)
    if (user.lastVerifyEmailOtpSentAt && Date.now() - user.lastVerifyEmailOtpSentAt < 60000) {
    return res.status(400).json({
      success: false,
      message: "Wait 60 sec before requesting new OTP",
      });
    }

    const OTP = crypto.randomInt(100000, 999999);

    const hashedOtp = await bcrypt.hash(OTP.toString(), 10);

     try {
             
        await sendEmail(
        email,
        "otp for verification",
        `<p>Your OTP is <b>${OTP}</b></p>`,
        );

        user.verifyEmailOtp = hashedOtp;
        user.verifyEmailOtpExpiry = Date.now() + 2 * 60 * 1000; //10 min
        user.lastVerifyEmailOtpSentAt = Date.now()
        await user.save(); 

        console.log("OTP SEND TO =====",email);
        

        } catch (err) {
          console.log("Error in sending OTP", err);
          
          return res.status(500).json({
            success: false,
            message: "Failed to send verification email. Please try later",
          });
        }

    res.status(200).json({
    success: true,
    message: "OTP has been sent to your email"
});    

  } catch (error) {
    console.log("error in resend otp email", error);

    return res.status(500).json({
      success: false,
      message: "failed to send email",
    });
  }
};

//##############################   login  ##############################
// OK
const loginUser = async (req, res) => {
  try {
    // client se email passward aaya
    let { email, password } = req.body;

    // email = email.trim().toLowerCase();

    // //validation
    // if (!email || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "email and password is required",
    //   });
    // }

    // 1. user existance
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "please verify your account first",
      });
    }

  //---------------- 3 attepts----------------------------------------------

    /// 1. Sabse pehle Block Check karo (Gatekeeper)
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked, try after 5 minutes.",
      });
    }

    // Password compare
    const isMatch = await bcrypt.compare(password, user.password);

    // Agar password GALAT hai
    if (!isMatch) {
      user.loginAttemps += 1;

      if (user.loginAttemps >= 3) {
        user.isBlocked = true;
        user.blockedUntill = new Date(Date.now() + 5 * 60 * 1000); // 1 hr block
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message: `Invalid credential. Attempts left: ${3 - user.loginAttemps}`,
      });
    }

    // Agar password SAHI hai, toh purani galtiyan (attempts) reset karo
    if (user.loginAttemps > 0) {
      user.loginAttemps = 0;
      user.isBlocked = false;
      user.blockedUntill = null;
      await user.save();
    }

  //----------------------------------

    // 4. jwt token Generate
    const token = jwt.sign
    (
        { userId: user._id }, // user info
        process.env.KEY,  //website key
        {
          expiresIn: "1d", //expiry
        }
    );

    //terminal
    if (token) {
      console.log("Login successfully", user._id);
      res.status(200).json({
        success: true,
        msg: "Login successfully",
        token: token,
      });
    } else {
      console.log("login failed");
      return res.status(400).json({
        success: false,
        message: "login failed.",
      });
    }

    // 7. response (token)
  } catch (error) {
    console.log("Error in login :", error);

    res.status(500).json({
      success: false,
      message: "something went wrong"
    });
  }
};


//########################## fogot password  ##############################
// OK
const forgetPassword = async (req, res) => {
  try {
    let { email } = req.body;

    //find user in DB
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(200).json({
        success: true,
        message: "If this email exists, OTP has been sent",
      });
    }


    if (findUser.lastResetPasswordOtpSentAt && Date.now() - findUser.lastResetPasswordOtpSentAt < 60000) {
    return res.status(429).json({
      success: false,
      message: "Wait 60 sec before requesting new OTP",
      });
    }

    console.log("last reset password otp sent------ :", findUser.lastResetPasswordOtpSentAt);
    

    // OTP generation - 6 digits
    const OTP = crypto.randomInt(100000, 999999);

    //hash OTP for backend
    const hashedOtp = await bcrypt.hash(OTP.toString(), 10);

    // sending email
    try {
      await sendEmail(
        email,
        "otp for reset password",
        `<p>Your OTP is <b>${OTP}</b></p>`,
      );

    //DB
    
    findUser.resetPasswordOtp = hashedOtp;
    findUser.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;
    findUser.lastResetPasswordOtpSentAt = Date.now();
    await findUser.save();

    console.log("reset otp --------:", findUser.resetPasswordOtp);
    console.log("reset password otp EXPIRY-----:",findUser.resetPasswordOtpExpiry);
    console.log("last rest password Otp sent ----------:",findUser.lastResetPasswordOtpSentAt);
    

    } catch (err) {
      console.log("error is sending Email for erset password");
      return res.status(400).json({
        success:false,
        message:"failed to sent otp"
      })
    }

    return res.status(200).json({
      success:true,
      message:"Email send successfully for reset password"
    })

    //------------------------
  
  } catch (error) {
    console.log("Error in forgotPassword :", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

//########################## reset password ##############################
// OK
const resetPassword = async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    // if (!email || !otp || !newPassword) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields are required",
    //   });
    // }

    //check email existance
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    //otp verify
    const isMatch = await bcrypt.compare(otp.toString(), user.resetPasswordOtp);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //expiry check
    if (
      user.resetPasswordOtpExpiry &&
      user.resetPasswordOtpExpiry < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    //password
    user.password = await bcrypt.hash(newPassword, 10);

    //reset all field and save
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null;
    user.lastResetPasswordOtpSentAt = null;
    const result = await user.save();

    if (result) {
      console.log("password reset successfully");
      return res.status(200).json({
        success: true,
        message: "Passsword reset successfully",
      });
    } else {
      console.log("unable to reset password");
      return res.status(404).json({
        success: false,
        message: "unable to reset password",
      });
    }
  } catch (error) {
    console.log("Error in reset password :", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong, unable to reset password",
    });
  }
};



//#########################################################3

module.exports = {
  registerUser,
  verifyEmail,
  resnedEmailOtp,

  loginUser,
  forgetPassword,
  resetPassword,
};

// Final Login Logic (Professional Version)

// 1... email + password lo

// 2...user find karo by email (Db me)

// 3...agar user nahi �  "user not found"

// 4...bcrypt.compare(password, user.password)

// 5...agar false �  invalid user or passward

// 6...agar true � JWT token generate

// 7...respose me token bhejo

// redies vs JWT
// signsture vs secretkey in token
// autharization vs authentication
// Cache and cookie ? browser se kya relation
// encrypt decrypt vs encoded decoded
// docker
// secrely store jwt - session cookies localstorage
// refresh token machenism
// sessionid vs cookie in statefull
// horizontl vertical server - load balancer
// API key
// registration k time per hi token milta hoga server se yaa fir jab login kroge next tb ?
// json vs object
