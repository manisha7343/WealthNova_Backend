const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    fullName: 
    {
        type: String,
        required: true,
        trim: true
    },

    username: 
    {
        type: String,
        required: true,
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

    profilePic: 
    {
        type: String,
        default: null // Shuruat me khali rahega jab tak user khud upload na kare
    },

    password: 
    {
        type: String,
        required: true,
        select: false
    },

    //------------------ OAuth -----------------------

    provider:
    {
        type: String,
        enum: ["local", "google"],
        default: "local"

    },

    providerId:
    {
        type: String,
        default: null

    },

    //------------ verify email ---------------
    refreshToken:
    {
        type: String,
        default: null,
        select: false,
    },

    lastLogin:
    {
        type: Date,
        default: null

    },

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
    
    //---------------------------------------------------
    isDeleted:
    {
        type: Boolean,
        default: false
    }
    
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;