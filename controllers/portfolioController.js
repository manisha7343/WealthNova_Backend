const Portfolio = require("../model/Portfolio");

// GET /api/portfolio
const getPortfolio = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.user }).sort({ createdAt: -1 });

    const totalInvested = holdings.reduce((acc, curr) => acc + curr.qty * curr.avgPrice, 0);
    const currentValue = holdings.reduce((acc, curr) => acc + curr.qty * curr.ltp, 0);
    const totalPnL = currentValue - totalInvested;
    const pnlPercentage = totalInvested > 0 ? Number(((totalPnL / totalInvested) * 100).toFixed(2)) : 0;

    return res.status(200).json({
      success: true,
      count: holdings.length,
      summary: {
        totalInvested: Math.round(totalInvested * 100) / 100,
        currentValue: Math.round(currentValue * 100) / 100,
        totalPnL: Math.round(totalPnL * 100) / 100,
        pnlPercentage,
      },
      data: holdings,
    });
  } catch (error) {
    console.error("Error in getPortfolio:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch portfolio holdings",
    });
  }
};

// POST /api/portfolio
const addHolding = async (req, res) => {
  try {
    const { symbol, qty, avgPrice, ltp, name } = req.body;

    if (!symbol || !qty || avgPrice === undefined || ltp === undefined) {
      return res.status(400).json({
        success: false,
        message: "Symbol, Quantity, Buy Price (avgPrice), and LTP are required.",
      });
    }

    const numQty = Number(qty);
    const numAvgPrice = Number(avgPrice);
    const numLtp = Number(ltp);

    if (numQty <= 0 || numAvgPrice < 0 || numLtp < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0, prices cannot be negative.",
      });
    }

    const cleanSymbol = symbol.toUpperCase().trim();

    // Check if asset already exists in user's portfolio
    let existing = await Portfolio.findOne({ user: req.user, symbol: cleanSymbol });

    if (existing) {
      // Calculate weighted average price
      const totalQty = existing.qty + numQty;
      const totalCost = (existing.qty * existing.avgPrice) + (numQty * numAvgPrice);
      existing.qty = totalQty;
      existing.avgPrice = Math.round((totalCost / totalQty) * 100) / 100;
      existing.ltp = numLtp;
      if (name) existing.name = name;

      await existing.save();

      return res.status(200).json({
        success: true,
        message: `Updated ${cleanSymbol} holdings in portfolio!`,
        data: existing,
      });
    }

    const newHolding = await Portfolio.create({
      user: req.user,
      symbol: cleanSymbol,
      name: name || cleanSymbol,
      qty: numQty,
      avgPrice: numAvgPrice,
      ltp: numLtp,
    });

    return res.status(201).json({
      success: true,
      message: `Added ${cleanSymbol} to portfolio!`,
      data: newHolding,
    });
  } catch (error) {
    console.error("Error in addHolding:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add asset to portfolio",
    });
  }
};

// PUT /api/portfolio/:id
const updateHolding = async (req, res) => {
  try {
    const { id } = req.params;
    const { qty, avgPrice, ltp, symbol, name } = req.body;

    const holding = await Portfolio.findOne({ _id: id, user: req.user });
    if (!holding) {
      return res.status(404).json({
        success: false,
        message: "Holding not found or access denied.",
      });
    }

    if (qty !== undefined) holding.qty = Number(qty);
    if (avgPrice !== undefined) holding.avgPrice = Number(avgPrice);
    if (ltp !== undefined) holding.ltp = Number(ltp);
    if (symbol) holding.symbol = symbol.toUpperCase().trim();
    if (name) holding.name = name.trim();

    await holding.save();

    return res.status(200).json({
      success: true,
      message: "Holding updated successfully!",
      data: holding,
    });
  } catch (error) {
    console.error("Error in updateHolding:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update holding",
    });
  }
};

// DELETE /api/portfolio/:id
const deleteHolding = async (req, res) => {
  try {
    const { id } = req.params;

    const holding = await Portfolio.findOneAndDelete({ _id: id, user: req.user });
    if (!holding) {
      return res.status(404).json({
        success: false,
        message: "Holding not found or already deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${holding.symbol} removed from portfolio successfully!`,
      data: holding,
    });
  } catch (error) {
    console.error("Error in deleteHolding:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove asset from portfolio",
    });
  }
};

// POST /api/portfolio/bulk
const bulkImport = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items array is required for bulk import.",
      });
    }

    let importedCount = 0;
    for (const item of items) {
      const { symbol, qty, avgPrice, ltp, name } = item;
      if (!symbol || !qty || avgPrice === undefined) continue;

      const numQty = Number(qty);
      const numAvgPrice = Number(avgPrice);
      const numLtp = ltp !== undefined && Number(ltp) > 0 ? Number(ltp) : numAvgPrice;

      if (numQty <= 0 || numAvgPrice < 0) continue;

      const cleanSymbol = symbol.toUpperCase().trim();
      let existing = await Portfolio.findOne({ user: req.user, symbol: cleanSymbol });

      if (existing) {
        const totalQty = existing.qty + numQty;
        const totalCost = (existing.qty * existing.avgPrice) + (numQty * numAvgPrice);
        existing.qty = totalQty;
        existing.avgPrice = Math.round((totalCost / totalQty) * 100) / 100;
        if (numLtp) existing.ltp = numLtp;
        if (name) existing.name = name.trim();
        await existing.save();
      } else {
        await Portfolio.create({
          user: req.user,
          symbol: cleanSymbol,
          name: name ? name.trim() : cleanSymbol,
          qty: numQty,
          avgPrice: numAvgPrice,
          ltp: numLtp,
        });
      }
      importedCount++;
    }

    return res.status(200).json({
      success: true,
      message: `Successfully imported ${importedCount} assets into your portfolio!`,
      count: importedCount,
    });
  } catch (error) {
    console.error("Error in bulkImport:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to bulk import holdings.",
    });
  }
};

module.exports = {
  getPortfolio,
  addHolding,
  updateHolding,
  deleteHolding,
  bulkImport,
};
