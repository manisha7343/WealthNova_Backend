const mongoose = require("mongoose");

const stockDetailSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true }, // e.g., RELIANCE.BSE
    name: { type: String, required: true },
    description: String,
    sector: String,
    industry: String,

    // Fundamentals (From OVERVIEW API)
    fundamentals: {
      marketCap: Number,
      peRatio: Number,
      pbRatio: Number,
      roe: Number, // Return on Equity / ROI
      roa: Number,
      profitMargin: Number,
      percentInsiders: Number, // Investor Holding %
      percentInstitutions: Number, // Institutional Holding %
      fiftyTwoWeekHigh: Number,
      fiftyTwoWeekLow: Number,
    },

    // Financials (From INCOME_STATEMENT & BALANCE_SHEET)
    financials: {
      totalRevenue: Number,
      netIncome: Number, // Profit / Loss
      grossProfit: Number,
      totalAssets: Number,
      totalLiabilities: Number,
      totalDebt: Number,
    },

    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockDetail", stockDetailSchema);