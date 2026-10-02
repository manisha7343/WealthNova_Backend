const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    source: { type: String, default: 'Global Market Wire' },
    link: { type: String },
    url: { type: String }, // support both link and url
    pubDate: { type: String },
    time: { type: String },
    desc: { type: String },
    description: { type: String }, // support both desc and description
    category: { type: String, default: 'General' },
    img: { type: String },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.News || mongoose.model('News', newsSchema);