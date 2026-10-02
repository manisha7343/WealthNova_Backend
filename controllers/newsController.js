const News = require('../model/News');

// Database se news nikal kar frontend ko dene ke liye
const getNewsData = async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    const filter = category ? { category: new RegExp(`^${category}$`, 'i') } : {};

    const news = await News.find(filter)
      .sort({ createdAt: -1, lastUpdated: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "News fetch karne mein error aa gaya",
      error: error.message,
    });
  }
};

const addNews = async (req, res) => {
  try {
    const { title, source, link, url, desc, description, category, img, time, pubDate } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "News title is required" });
    }

    const newsItem = await News.findOneAndUpdate(
      { title: title.trim() },
      {
        title: title.trim(),
        source: source || "Market Wire",
        link: link || url || "",
        url: url || link || "",
        desc: desc || description || "",
        description: description || desc || "",
        category: category || "General",
        img: img || "",
        time: time || pubDate || "Recently",
        pubDate: pubDate || time || new Date().toISOString(),
        lastUpdated: new Date(),
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    res.status(201).json({
      success: true,
      message: "News saved successfully",
      data: newsItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save news",
      error: error.message,
    });
  }
};

module.exports = { getNewsData, addNews };