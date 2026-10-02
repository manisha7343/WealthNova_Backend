const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    change: { type: Number, required: true },
    percentChange: { type: Number, required: true },
    category: {
      type: String,
      enum: ['INDEX', 'GAINER', 'LOSER', 'COMMODITY', 'FOREX', 'STOCK'],
      default: 'INDEX',
    },
    exchange: { type: String, default: 'NSE' },
    volume: { type: mongoose.Schema.Types.Mixed, default: 0 },
    desc: { type: String, default: '' },
    high52w: { type: Number },
    low52w: { type: Number },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Market || mongoose.model('Market', marketSchema);