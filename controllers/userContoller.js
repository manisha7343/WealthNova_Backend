const { log } = require("console");
const User = require("../model/user");
// const { RateLimiterQueue } = require("rate-limiter-flexible");
require("dotenv").config();
const bcrypt = require("bcryptjs");

//########################### get profile ##############################
// wrong - projection

const getProfile = async (req, res) => {
  try {
    //DB - user find
    const user = await User.findOne(
      { _id: req.user, isDeleted: { $ne: true } },
      {
        fullName: 1,
        userName: 1,
        email: 1,
        country: 1,
        // profilePic: 1, //photo
      },
    );

    console.log("user : ", user);

    //terminal
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: user,
      });
    } else {
      console.log("user profile fetched successfully");
      res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        user: user,
      });
    }
  } catch (error) {
    console.log("Error to get profile", error);

    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//##################### update profile ##################
// fail
const updateProfile = async (req, res) => {
  try {
    const { fullName, country } = req.body;

    //DB
    const result = await User.updateOne(
      { _id: req.user, isDeleted: { $ne: true } },
      {
        $set: {
          fullName: fullName,
          country: country,

          // profilePic: ProfilePic,
        },
      },
    );

    //if user not found
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found.",
      });
    }

    //if data not chngaes or the same data is sent
    if (result.modifiedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes made to Profile!.",
      });
    }

    console.log("User updated successfully");
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully!",
    });
  } catch (error) {
    console.log("Error in upadting user : ", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating your profile. Please try again later.",
    });
  }
};

//###################### Delete profile/Account ####################
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found or Account already deleted!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Account Deleted Successfully",
    });
  } catch (error) {
    console.log("Error in deleting user: ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting profile",
    });
  }
};

//###################### change password (🔴 Need anothor Rate limiting)############## 🔴 validation
const changePassword = async (req, res) => {
  try {
    //1. take body
    const { oldPassword, newPassword } = req.body;

    //2. fetch user froom DB
    const user = await User.findOne({
      _id: req.user,
      isDeleted: { $ne: true },
    }).select("+password");

    //3. if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or account deactivated!",
      });
    }

    //4. compare newPassword with the oldpPssword
    const matchPassword = await bcrypt.compare(oldPassword, user.password);

    // console.log("MatchPassword---------------", matchPassword);
    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Incurrect current password",
      });
    }

    //5 check if user entred the smae password again
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as old password!",
      });
    }

    //5. Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updatedd successfully",
    });
  } catch (error) {
    console.log("Error in Change password!");

    return res.status(500).json({
      success: false,
      message: "Something went wrong while chnaging password!",
    });
  }
};

// ################### mutler upload ########################### 🔴validtaion
const uploadProfilePic = async (req, res) => {
  try {
    //1. check kro file request me aayi ki nhi 
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image to upload!"
      });
    }

    //2. get image path and store
    const imageUrl = req.file.path || req.file.secure_url || req.file.url;

    // console.log("UPLOAD CONTROLLER HIT");
    // console.log("FILE:", req.file);

    //3. update profilePic
    const user = await User.findByIdAndUpdate(
      req.user,
      { profilePic: imageUrl },
      { new: true },
    ).select("-password");

    //4, if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      })
    }

    // 5. PURANI IMAGE DELETE LOGIC (Yahan aayega!)
    if (existingUser.profilePic) {
      // URL se Public ID extract karo
      const publicId = existingUser.profilePic.split('/').pop().split('.')[0];
      
      // Cloudinary se purani photo delete karo
      await cloudinary.uploader.destroy(`wealthNova_user_profiles/${publicId}`);
    }

    //6. response
    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully!",
      profilePic: imageUrl,
    });

  } catch (error) {
    console.log("Error in uploading pic: ", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
// ----------------------------------------------------------

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  changePassword,
  uploadProfilePic
};

/* 
==================================================================
                 uploadProfilePic
==================================================================

1. [CLIENT/POSTMAN] 
   - User Put request bhejta hai: /api/users/uploadProfilePic
   - Headers: Authorization (Bearer token)
   - Body (form-data): Key = 'profilePic', Value = File/Image

2. [AUTH MIDDLEWARE]
   - Check karta hai token valid hai ya nahi.
   - User ID verify karke `req.user` mein set karta hai.
   - `next()` call karke request aage bhejta hai.

3. [MULTER + CLOUDINARY MIDDLEWARE]
   - `upload.single('profilePic')` active hota hai.
   - Form-data se 'profilePic' key wali file pick karta hai.
   - Cloudinary par image upload karta hai.
   - Success ke baad image ka saara data ek object banakar 
     `req.file` mein daal deta hai (e.g., req.file.path / secure_url).
   - Internally `next()` call karke request controller ko pass karta hai.

4. [CONTROLLER: uploadProfilePic]
   - Step A: Check karta hai `req.file` mila ya nahi.
   - Step B: Image URL nikaalta hai (`req.file.path || req.file.secure_url`).
   - Step C: Database mein `User.findByIdAndUpdate()` se `profilePic` field set karta hai.
   - Step D: Response bhejta hai `res.status(200).json({ success: true, profilePic })`.

5. [CLIENT/POSTMAN RESPONSE]
   - User ko JSON response milta hai aur request successfully end ho jaati hai!
==================================================================
*/