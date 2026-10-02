const { log } = require("console");
const User = require("../model/user");
// const { RateLimiterQueue } = require("rate-limiter-flexible");
require("dotenv").config();
const bcrypt = require("bcryptjs");

//########################### get profile #############################

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
        profilePic: 1, //photo
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
const updateProfile = async (req, res) => {
  try {
    const { fullName, country } = req.body;
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (country !== undefined) updateData.country = country.trim();

    const user = await User.findOneAndUpdate(
      { _id: req.user, isDeleted: { $ne: true } },
      { $set: updateData },
      { returnDocument: "after" }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or account deactivated.",
      });
    }

    console.log("User updated successfully:", user._id);
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully!",
      user: {
        _id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        country: user.country,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log("Error in updating user : ", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while updating your profile. Please try again later.",
    });
  }
};

//###################### Delete profile/Account ####################
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or Account already deleted!",
      });
    }

    console.log("User account deleted successfully:", user._id);
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
        message: "Please select an image to upload!",
      });
    }

    //2. get image path and store
    const imageUrl = req.file.path || req.file.secure_url || req.file.url;

    // ---------testing ------------------
    // console.log("UPLOAD CONTROLLER HIT");
    // console.log("FILE:", req.file);
    console.log("IMAGE URL:", imageUrl);
    // ------------------------------------ 

    // Find user to check for old profile picture
    const existingUser = await User.findById(req.user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const oldProfilePic = existingUser.profilePic;

    //3. update profilePic
    const user = await User.findByIdAndUpdate(
      req.user,
      { profilePic: imageUrl },
      { returnDocument: "after" },
    ).select("-password");
    // ---------------------------- # testing ----------------------
    console.log("SAVED PROFILE PIC:", user.profilePic);
    // ----------------------------------------

    //4, if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // 5. PURANI IMAGE DELETE LOGIC
    if (oldProfilePic && typeof oldProfilePic === "string" && oldProfilePic.includes("cloudinary.com")) {
      try {
        const cloudinary = require("cloudinary").v2;
        const parts = oldProfilePic.split("/");
        const filename = parts.pop().split(".")[0];
        const folder = parts.includes("wealthNova_user_profiles") ? "wealthNova_user_profiles/" : "";
        await cloudinary.uploader.destroy(`${folder}${filename}`);
      } catch (cloudinaryErr) {
        console.warn("Cloudinary old photo cleanup non-fatal warning:", cloudinaryErr.message);
      }
    }

    //6. response
    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully!",
      profilePic: imageUrl,
    });
  } catch (error) {
    console.error("Error in uploading pic: ", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while uploading profile picture",
    });
  }
};

// ################### Remove / Delete Profile Picture ###########################
const deleteProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const oldProfilePic = user.profilePic;

    // Delete image from Cloudinary if it exists
    if (oldProfilePic && typeof oldProfilePic === "string" && oldProfilePic.includes("cloudinary.com")) {
      try {
        const cloudinary = require("cloudinary").v2;
        const parts = oldProfilePic.split("/");
        const filename = parts.pop().split(".")[0];
        const folder = parts.includes("wealthNova_user_profiles") ? "wealthNova_user_profiles/" : "";
        await cloudinary.uploader.destroy(`${folder}${filename}`);
      } catch (cloudinaryErr) {
        console.warn("Cloudinary photo deletion warning:", cloudinaryErr.message);
      }
    }

    // Set profilePic to empty string
    user.profilePic = "";
    await user.save();

    console.log("Profile pic removed successfully for user:", req.user);
    return res.status(200).json({
      success: true,
      message: "Profile picture removed successfully!",
      profilePic: "",
    });
  } catch (error) {
    console.error("Error in deleteProfilePic:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove profile picture",
    });
  }
};
// ----------------------------------------------------------

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  changePassword,
  uploadProfilePic,
  deleteProfilePic,
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
