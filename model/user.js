const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    userName: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      default: null,
      required: true,
      select: false,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    profilePic: {
      type: String,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    blockedUntil: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;