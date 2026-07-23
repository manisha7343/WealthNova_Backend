const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true  
    },
    profilePic: {
    type: String,
    default: "" // Shuruat me khali rahega jab tak user khud upload na kare
    },
    password: {
        type: String,
        required: true
    },

    //------------ verify email ---------------
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    verifyEmailOtp: {
        type: String,
        default: null
    },
    verifyEmailOtpExpiry: {
        type: Date,
        default: null
    },
    lastVerifyEmailOtpSentAt:{
        type:Date,
        default:null
    },

    //--------------- 3 failed login attempts ----------
    isBlocked: {
        type: Boolean,
        default: false, 
    },
    loginAttemps: {
        type: Number,
        default: 0
    },
    blockedUntill: {
        type: Date,
        default: null 
    },
    
    //---------- forget password -------------------
    resetPasswordOtp: {
        type: String,
        default: null
    },
    resetPasswordOtpExpiry: {
        type: Date,
        default: null
    },
    lastResetPasswordOtpSentAt:{
        type: Date,
        default: null
    }
    
    
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;