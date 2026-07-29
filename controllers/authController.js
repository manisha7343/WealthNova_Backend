// authController - register, login, profile
const User = require("../model/user");
const sendEmail = require("../utils/Email_utile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

// const redis = require("../config/redis")

// #######################   register user  ######################

//OK
const registerUser = async (req, res) => {
  try {
    let { fullName, userName, email, password, country } = req.body;

    //2. check user already exits ?
    const existinguser = await User.findOne({ 
      $or: [{email},{userName}]
     });
    if (existinguser && existinguser._id) {
      return res.status(409).json({
        success: false,
        message: 
        existinguser.email == email 
        ? "Email alreay exists"
        : "username alreay exists"
      });
    }

    // 3. passward hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. create user
    const result = await User.create({
      fullName: fullName,
      userName: userName,
      email: email,
      password: hashedPassword,
      country: country,
    });

    console.log("USER REGISTERED SUCCESSFULLY", result);


    return res.status(201).json({
      success: true,
      message: "registered successfully!",
    });
  } catch (error) {
    console.log("Error in register User : ", error);

    res.status(500).json({
      success: false,
      message: "something went wrong/Error",
    });
  }
};



//##############################   login  ##############################
// OK
const loginUser = async (req, res) => {
  try {
    // client se email passward aaya
    let { login, password } = req.body;

    // email = email.trim().toLowerCase();

    // 1. user existance
    const user = await User.findOne({
      $or: [{ email: login }, {username: login}],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid Credential",
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
      user.loginAttempts += 1;

      if (user.loginAttempts >= 3) {
        user.isBlocked = true;
        user.blockedUntil = new Date(Date.now() + 5 * 60 * 1000); // 1 hr block
      } await user.save();

      return res.status(401).json({
        success: false,
        message: `Invalid credential. Attempts left: ${3 - user.loginAttempts}`,
      });
    }

    // Agar password SAHI hai, toh purani galtiyan (attempts) reset karo
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.isBlocked = false;
      user.blockedUntil = null;
      await user.save();
    }

    //----------------------------------

    // 4. jwt token Generate
    const token = jwt.sign(
      { userId: user._id }, // user info
      process.env.KEY, // website key
      {
        expiresIn: "1d", //expiry
      },
    );

    //terminal
      console.log("Login successfully", user._id);

      return res.status(200).json({
        success: true,
        msg: "Login successfully",
        token: token,
      });


    // 7. response (token)
  } catch (error) {
    console.log("Error in login :", error);

    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//#########################################################3

module.exports = {
  registerUser,
  loginUser,
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
