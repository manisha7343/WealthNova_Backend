const Crypto = require('../model/Crypto');

// GET /api/crypto
const getCryptoPulse = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ rank: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: cryptos.length,
      data: cryptos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/crypto/upsert
const upsertCrypto = async (req, res) => {
  try {
    const { symbol, name, price, change, why, rank } = req.body;
    if (!symbol || !name || price === undefined) {
      return res.status(400).json({ success: false, message: "symbol, name, price are required" });
    }

    const item = await Crypto.findOneAndUpdate(
      { symbol: symbol.toUpperCase().trim() },
      {
        symbol: symbol.toUpperCase().trim(),
        name,
        price,
        change: Number(change) || 0,
        why: why || "",
        rank: Number(rank) || 0,
        lastUpdated: new Date(),
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: "Crypto data saved", data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCryptoPulse,
  upsertCrypto,
};
