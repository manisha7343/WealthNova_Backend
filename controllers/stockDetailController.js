const StockDetails = require("../model/stockDetails");

// ============================================================
// MANUAL ADD STOCK
// POST /api/stocks/manual-add
// ============================================================

const manualAddStock = async (req, res) => {
  try {
    const { symbol, nseSymbol } = req.body;

    // -------------------------
    // Basic validation
    // -------------------------
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "symbol is required",
      });
    }

    const cleanSymbol = symbol.toUpperCase().trim();

    // -------------------------
    // Data to save (Req.body ka poora payload spread kiya hai)
    // -------------------------
    const stockData = {
      ...req.body, // Sub-arrays aur nested fields ko include karne ke liye
      symbol: cleanSymbol,
      nseSymbol: nseSymbol
        ? nseSymbol.toUpperCase().trim()
        : cleanSymbol,
      lastUpdated: new Date(),
    };

    // -------------------------
    // Save / Update in DB
    // -------------------------
    const stock = await StockDetails.findOneAndUpdate(
      { symbol: cleanSymbol },
      { $set: stockData },
      {
        upsert: true,
        returnDocument: "after", // Deprecation warning ka fix
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: `${cleanSymbol} successfully saved in DB`,
      data: stock,
    });
  } catch (error) {
    console.error("Manual stock save error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save stock",
      error: error.message,
    });
  }
};

module.exports = {
  manualAddStock,
};