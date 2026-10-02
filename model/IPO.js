const mongoose = require('mongoose');

const ipoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    price: { type: String, required: true },
    size: { type: String, required: true },
    status: {
      type: String,
      enum: ['Upcoming', 'Closed', 'Listed', 'Filed DRHP', 'Active'],
      default: 'Upcoming',
    },
    exchange: { type: String, default: 'NSE / BSE' },
    lotSize: { type: String, default: 'N/A' },
    minInvestment: { type: String, default: 'N/A' },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.IPO || mongoose.model('IPO', ipoSchema);