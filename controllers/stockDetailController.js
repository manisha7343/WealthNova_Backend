const axios = require("axios");
const StockDetail = require("../model/stockDetails");

// Alpha Vantage rate-limit ke liye delay
const sleep = (ms = 13000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Default stocks — batch API mein payload na bhejne par ye use honge
const DEFAULT_INDIAN_STOCKS = [
  "RELIANCE.BSE",
  "TCS.BSE",
  "INFY.BSE",
  "HDFCBANK.BSE",
  "ICICIBANK.BSE",
  "TATAMOTORS.BSE",
  "SBIN.BSE",
  "BHARTIARTL.BSE",
];

// ============================================================
// SINGLE STOCK: Alpha Vantage se data fetch + MongoDB mein save
// ============================================================

const fetchAndSaveSingleStock = async (symbol) => {
  const apiKey = process.env.ALPHA_VANTAGE_KEY;

  if (!apiKey) {
    throw new Error("ALPHA_VANTAGE_KEY is missing in .env");
  }

  // Safety check: object accidentally pass hone par [object Object] nahi aayega
  if (typeof symbol !== "string" || !symbol.trim()) {
    throw new Error("Valid stock symbol is required");
  }

  symbol = symbol.trim().toUpperCase();

  console.log("\n-----------------------------------");
  console.log(`Fetching ${symbol} to dump the data...`);

  // 1. Basic Fundamentals
  console.log(`[SYNC] Basic Fundamentals for ${symbol}...`);

  const fundamentalRes = await axios.get(
    `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${apiKey}`
  );

  const fundamentalData = fundamentalRes.data || {};

  // Alpha Vantage error/rate-limit response check
  if (
    fundamentalData.Note ||
    fundamentalData.Information ||
    fundamentalData["Error Message"]
  ) {
    throw new Error(
      fundamentalData.Note ||
        fundamentalData.Information ||
        fundamentalData["Error Message"]
    );
  }

  await sleep();

  // 2. Income Statement
  console.log(`[SYNC] Income Statement for ${symbol}...`);

  const incomeRes = await axios.get(
    `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${apiKey}`
  );

  const incomeData = incomeRes.data || {};

  if (
    incomeData.Note ||
    incomeData.Information ||
    incomeData["Error Message"]
  ) {
    throw new Error(
      incomeData.Note ||
        incomeData.Information ||
        incomeData["Error Message"]
    );
  }

  const latestIncome = incomeData.quarterlyReports?.[0] || {};

  await sleep();

  // 3. Balance Sheet
  console.log(`[SYNC] Balance Sheet for ${symbol}...`);

  const balanceRes = await axios.get(
    `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${apiKey}`
  );

  const balanceData = balanceRes.data || {};

  if (
    balanceData.Note ||
    balanceData.Information ||
    balanceData["Error Message"]
  ) {
    throw new Error(
      balanceData.Note ||
        balanceData.Information ||
        balanceData["Error Message"]
    );
  }

  const latestBalance = balanceData.quarterlyReports?.[0] || {};

  // ============================================================
  // MongoDB Payload
  // ============================================================

  const stockPayload = {
    symbol,

    name: fundamentalData.Name || symbol,
    description: fundamentalData.Description || "",
    sector: fundamentalData.Sector || "",
    industry: fundamentalData.Industry || "",

    fundamentals: {
      marketCap: Number(fundamentalData.MarketCapitalization) || 0,
      peRatio: Number(fundamentalData.PERatio) || 0,
      pbRatio: Number(fundamentalData.PriceToBookRatio) || 0,

      // Return on Equity
      roe: Number(fundamentalData.ReturnOnEquityTTM) || 0,

      // Return on Assets
      roa: Number(fundamentalData.ReturnOnAssetsTTM) || 0,

      profitMargin: Number(fundamentalData.ProfitMargin) || 0,

      percentInsiders: Number(fundamentalData.PercentInsiders) || 0,
      percentInstitutions:
        Number(fundamentalData.PercentInstitutions) || 0,

      fiftyTwoWeekHigh: Number(fundamentalData["52WeekHigh"]) || 0,
      fiftyTwoWeekLow: Number(fundamentalData["52WeekLow"]) || 0,
    },

    financials: {
      totalRevenue: Number(latestIncome.totalRevenue) || 0,
      netIncome: Number(latestIncome.netIncome) || 0,
      grossProfit: Number(latestIncome.grossProfit) || 0,

      totalAssets: Number(latestBalance.totalAssets) || 0,
      totalLiabilities:
        Number(latestBalance.totalLiabilities) || 0,

      totalDebt:
        Number(latestBalance.shortLongTermDebtTotal) || 0,
    },

    lastUpdated: new Date(),
  };

  // Upsert:
  // Stock already exists -> update
  // Stock does not exist -> create
  const updatedStock = await StockDetail.findOneAndUpdate(
    { symbol },
    stockPayload,
    {
      upsert: true,
      returnDocument: "after",
    }
  );

  console.log(`[SINGLE SYNC COMPLETE] ${symbol} saved successfully.`);

  return updatedStock;
};

// ============================================================
// SINGLE STOCK API
// POST /api/stocks/single-stock
// Body: { "symbol": "TCS.BSE" }
// ============================================================

const syncStockFundamentals = async (req, res) => {
  const { symbol } = req.body || {};

  if (typeof symbol !== "string" || !symbol.trim()) {
    return res.status(400).json({
      success: false,
      message: "Stock symbol is required",
    });
  }

  try {
    const data = await fetchAndSaveSingleStock(symbol);

    return res.status(200).json({
      success: true,
      message: `Stock fundamentals synced successfully for ${symbol}`,
      data,
    });
  } catch (error) {
    console.error("[SINGLE SYNC ERROR]:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// ============================================================
// BATCH STOCK API
// POST /api/stocks/batch-stock
//
// Payload optional:
//
// {
//   "symbols": ["TCS.BSE", "INFY.BSE"]
// }
//
// Payload na bhejne par DEFAULT_INDIAN_STOCKS use honge.
// ============================================================

const fetchAndSaveBatchStock = async (req, res) => {
  const requestedSymbols = req.body?.symbols;

  let stockList;

  if (requestedSymbols === undefined) {
    stockList = DEFAULT_INDIAN_STOCKS;
  } else {
    if (
      !Array.isArray(requestedSymbols) ||
      requestedSymbols.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "symbols must be a non-empty array",
      });
    }

    if (
      requestedSymbols.some(
        (symbol) => typeof symbol !== "string" || !symbol.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Every stock symbol must be a valid string",
      });
    }

    stockList = requestedSymbols.map((symbol) =>
      symbol.trim().toUpperCase()
    );
  }

  // Immediate response.
  // Actual syncing background mein continue hoti rahegi.
  res.status(200).json({
    success: true,
    message: `Batch sync started in background for ${stockList.length} stocks.`,
    symbols: stockList,
  });

  // Stocks one-by-one process honge.
  for (let i = 0; i < stockList.length; i++) {
    const symbol = stockList[i];

    try {
      await fetchAndSaveSingleStock(symbol);

      // Next stock se pehle delay.
      if (i < stockList.length - 1) {
        await sleep();
      }
    } catch (error) {
      console.error(
        `[BATCH ERROR] Failed for ${symbol}:`,
        error.message
      );
    }
  }

  console.log("\n===================================");
  console.log("Batch stock sync completed.");
  console.log("===================================");
};

// ============================================================
// GET ALL STOCK DETAILS
// GET /api/stocks/fundamentals
// ============================================================

const getAllStockDetails = async (req, res) => {
  try {
    const stocks = await StockDetail.find().sort({
      "fundamentals.marketCap": -1,
    });

    return res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks,
    });
  } catch (error) {
    console.error("[GET STOCK ERROR]:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  syncStockFundamentals,
  fetchAndSaveSingleStock,
  fetchAndSaveBatchStock,
  getAllStockDetails,
};

