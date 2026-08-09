const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    fullName: 
    {
        type: String,
        required: true,
        trim: true
    },

    userName: 
    {
        type: String,
        required: true,
        index: true,    
        unique: true,
        lowercase: true,
        trim: true,
    },

    email:
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true  
    },
    password: 
    {
        type: String,
        default: null,
        required: true,
        select: false
    },
    country:
    {
        type: String,
        required:true,
        trim: true,

    },

    //---------------------------------------------------------------------------

    profilePic: 
    {
        type: String,
        default: null // Shuruat me khali rahega jab tak user khud upload na kare
    },
    
    isDeleted:{
        type: Boolean,
        default: false
    },

    

    //------------ verify email Manual---------------

    // isEmailVerified: {
    //     type: Boolean,
    //     default: false
    // },
    // verifyEmailOtp: {
    //     type: String,
    //     default: null
    // },
    // verifyEmailOtpExpiry: {
    //     type: Date,
    //     default: null
    // },
    // lastVerifyEmailOtpSentAt:{
    //     type:Date,
    //     default:null
    // },

    //------------------ OAuth -----------------------

    // provider:
    // {
    //     type: String,
    //     enum: ["local", "google"],
    //     default: "local"

    // },

    // providerId:
    // {
    //     type: String,
    //     default: null

    // },

    //--------------- 3 failed login attempts ----------
    isBlocked: 
    {
        type: Boolean,
        default: false, 
    },

    loginAttempts: 
    {
        type: Number,
        default: 0
    },

    blockedUntil: 
    {
        type: Date,
        default: null 
    },
    //---------- forget password -------------------
    // resetPasswordOtp: {
    //     type: String,
    //     default: null
    // },
    // resetPasswordOtpExpiry: {
    //     type: Date,
    //     default: null
    // },
    // lastResetPasswordOtpSentAt:{
    //     type: Date,
    //     default: null
    // },
    
    //---------------------------------------------------

    
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;