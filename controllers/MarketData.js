const Market = require('../model/market');

// GET /api/market
const getMarketData = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: new RegExp(`^${category}$`, 'i') } : {};
    const data = await Market.find(filter).sort({ symbol: 1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/market/indices
const getIndices = async (req, res) => {
  try {
    const indices = await Market.find({
      category: { $in: ['INDEX', 'COMMODITY', 'FOREX'] },
    }).sort({ symbol: 1 });

    res.status(200).json({
      success: true,
      count: indices.length,
      data: indices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/market/gainers-losers
const getGainersAndLosers = async (req, res) => {
  try {
    const gainers = await Market.find({ category: 'GAINER' }).sort({ percentChange: -1 }).limit(10);
    const losers = await Market.find({ category: 'LOSER' }).sort({ percentChange: 1 }).limit(10);

    res.status(200).json({
      success: true,
      data: {
        gainers,
        losers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/market/upsert
const upsertMarketItem = async (req, res) => {
  try {
    const { symbol, name, price, change, percentChange, category, exchange, volume, desc } = req.body;
    if (!symbol || !name || price === undefined) {
      return res.status(400).json({ success: false, message: "symbol, name, and price are required" });
    }

    const item = await Market.findOneAndUpdate(
      { symbol: symbol.toUpperCase().trim() },
      {
        symbol: symbol.toUpperCase().trim(),
        name,
        price: Number(price),
        change: Number(change) || 0,
        percentChange: Number(percentChange) || 0,
        category: category || 'INDEX',
        exchange: exchange || 'NSE',
        volume: volume || '',
        desc: desc || '',
        lastUpdated: new Date(),
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: "Market data updated", data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/market/stocks
const getMarketStocks = async (req, res) => {
  try {
    const stocks = await Market.find({
      category: { $in: ['STOCK', 'GAINER', 'LOSER'] },
    }).sort({ percentChange: -1 });

    res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMarketData,
  getIndices,
  getGainersAndLosers,
  getMarketStocks,
  upsertMarketItem,
};