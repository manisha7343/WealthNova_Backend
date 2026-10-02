// STOCK FUNDAMENTAL FULL ------
const StockDetails = require("../model/stockDetails");
const Market = require("../model/market");

// ============================================================
// MANUAL ADD STOCK
// POST /api/stocks/manual-add
// ============================================================

const manualAddStock = async (req, res) => {
  try {
    const { symbol, nseSymbol } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "symbol is required",
      });
    }

    const cleanSymbol = symbol.toUpperCase().trim();

    const stockData = {
      ...req.body,
      symbol: cleanSymbol,
      nseSymbol: nseSymbol
        ? nseSymbol.toUpperCase().trim()
        : cleanSymbol,
      lastUpdated: new Date(),
    };

    const stock = await StockDetails.findOneAndUpdate(
      { symbol: cleanSymbol },
      { $set: stockData },
      {
        upsert: true,
        returnDocument: "after",
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


// ============================================================
// SEARCH STOCKS CONTROLLER
// 1. Without query: Returns formatted table rows for Watchlist
// 2. With query: Returns FULL details of searched stock(s)
// ============================================================

const searchStocks = async (req, res) => {
  try {
    const { query } = req.query;

    // Case 1: Agar query di hai (e.g. ?query=TCS) -> Return FULL DATA
    if (query && query.trim() !== "") {
      const searchRegex = new RegExp(query.trim(), "i");
      const filter = {
        $or: [
          { symbol: searchRegex },
          { nseSymbol: searchRegex },
          { companyName: searchRegex },
          { shortName: searchRegex },
        ],
      };

      const fullStockData = await StockDetails.find(filter);

      return res.status(200).json({
        success: true,
        type: "FULL_DETAILS",
        count: fullStockData.length,
        data: fullStockData, // Pura DB document (raw nested arrays samet)
      });
    }

    // Case 2: Agar query blank hai -> Return Formatted List for Watchlist Table
    const rawStocks = await StockDetails.find({});

    const formattedStocks = rawStocks.map((stock, index) => {
      const latestQtr =
        Array.isArray(stock.quarterlyResults) && stock.quarterlyResults.length > 0
          ? stock.quarterlyResults[stock.quarterlyResults.length - 1]
          : null;

      const latestBS =
        Array.isArray(stock.balanceSheet) && stock.balanceSheet.length > 0
          ? stock.balanceSheet[stock.balanceSheet.length - 1]
          : null;

      const latestPL =
        Array.isArray(stock.profitLoss) && stock.profitLoss.length > 0
          ? stock.profitLoss[stock.profitLoss.length - 1]
          : null;

      const latestRatio =
        Array.isArray(stock.ratios) && stock.ratios.length > 0
          ? stock.ratios[stock.ratios.length - 1]
          : null;

      const cmp = stock.marketData?.currentPrice || 0;
      const bv = stock.marketData?.bookValue || 1;
      const cmpBv = bv !== 0 ? +(cmp / bv).toFixed(2) : 0;

      return {
        id: stock._id,
        sNo: index + 1,
        name: stock.companyName || stock.symbol,
        symbol: stock.symbol,
        cmp: cmp,
        marCap: stock.marketData?.marketCap || 0,
        fairVal: 0,
        pe: stock.marketData?.peRatio || 0,
        cmpBv: cmpBv,
        divYld: stock.marketData?.dividendYield || 0,
        npQtr: latestQtr?.netProfit || 0,
        opm: latestQtr?.opm || latestPL?.opm || 0,
        rsi: 0,
        roce: latestRatio?.roce || 0,
        sales: latestPL?.sales || 0,
        roe: stock.growth?.profitGrowth?.ttm || 0,
        debt: latestBS?.borrowings || 0,
        cwip: latestBS?.cwip || 0,
        peg: 0,
      };
    });

    return res.status(200).json({
      success: true,
      type: "WATCHLIST_TABLE",
      count: formattedStocks.length,
      data: formattedStocks,
    });
  } catch (error) {
    console.error("Search stock error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search stocks",
      error: error.message,
    });
  }
};





module.exports = {
  manualAddStock,
  searchStocks,

};