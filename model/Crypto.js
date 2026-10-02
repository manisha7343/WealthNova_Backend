const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true },
    change: { type: Number, required: true },
    why: { type: String, required: true },
    rank: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Crypto || mongoose.model('Crypto', cryptoSchema);
