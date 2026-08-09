const { log } = require("console");
const User = require("../model/user");
const { RateLimiterQueue } = require("rate-limiter-flexible");
require("dotenv").config();

//########################### get profile ##############################
// wrong - projection

const getProfile = async (req, res) => {
  try {

    //DB - user find
    const user = await User.findOne({_id:req.user, isDeleted: { $ne: true}}, {
      fullName: 1,
      userName: 1,
      email: 1,
      country: 1,
      _id:0
      // profilePic: 1, //photo
    });

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

    const {fullName, country } = req.body;

    //DB
    const result = await User.updateOne({ _id: req.user , isDeleted: { $ne: true}}, 
      {
        $set:{
          fullName: fullName,
          country: country,
          
          // profilePic: ProfilePic,
        }
      }
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
      success:true,
      message:"User profile updated successfully!"
    })

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
const deleteAccount = async (req,res)=>{
  try{

    const user = await User.findOneAndUpdate(
      { _id:req.user, isDeleted:{ $ne : true}},
      { $set: { isDeleted:true}},
      {new:true}
    )
    

    if(!user){
      return res.status(404).json({
        success:false,
        message:"user not found or Account already deleted!"
      })
    }
      

    return res.status(200).json({
      success:true,
      message:"User Account Deleted Successfully"
    })
    
  }catch (error) {
    console.log("Error in deleting user: ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting profile"
    });
  }
};

// ################### mutler upload ###########################

// const uploadProfilePic = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "Koi file select nahi ki!" });
//     }

//     const imagePath = req.file.path;

//     await User.updateOne(
//       { _id: req.user }, 
//       { $set: { profilePic: imagePath } }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Profile picture uploaded successfully!",
//       profilePic: imagePath,
//     });

//   } catch (error) {
//     console.log("Error in uploading pic: ", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// ----------------------------------------------------------

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  // uploadProfilePic
 
};
