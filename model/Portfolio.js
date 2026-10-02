const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    qty: {
      type: Number,
      required: true,
      min: 0,
    },
    avgPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    ltp: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

portfolioSchema.index({ user: 1, symbol: 1 });

module.exports = mongoose.models.Portfolio || mongoose.model("Portfolio", portfolioSchema);
