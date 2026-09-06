const axios = require("axios");
const StockDetail = require("../model/stockDetails");

// 13 seconds delay function
const sleep = (ms = 13000) => new Promise((resolve) => setTimeout(resolve, ms));

// Default Top Nifty/BSE Indian Stocks
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

// Helper Function: Single Stock Sync Logic
const fetchAndSaveSingleStock = async (symbol) => {
  const apiKey = process.env.ALPHA_VANTAGE_KEY;

  console.log(`\n-----------------------------------`);
  console.log(`[SYNC START] Overview for ${symbol}...`);

  // 1. Fetch OVERVIEW
  const overviewRes = await axios.get(
    `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
  );
  const ov = overviewRes.data || {};
  await sleep(13000);

  // 2. Fetch INCOME_STATEMENT
  console.log(`[SYNC] Income Statement for ${symbol}...`);
  const incomeRes = await axios.get(
    `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}`
  );
  const latestIncome = incomeRes.data?.quarterlyReports?.[0] || {};
  await sleep(13000);

  // 3. Fetch BALANCE_SHEET
  console.log(`[SYNC] Balance Sheet for ${symbol}...`);
  const balanceRes = await axios.get(
    `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${apiKey}`
  );
  const latestBalance = balanceRes.data?.quarterlyReports?.[0] || {};

  // Payload structure
  const stockPayload = {
    symbol: symbol,
    name: ov.Name || symbol,
    description: ov.Description || "",
    sector: ov.Sector || "",
    industry: ov.Industry || "",
    fundamentals: {
      marketCap: Number(ov.MarketCapitalization) || 0,
      peRatio: Number(ov.PERatio) || 0,
      pbRatio: Number(ov.PriceToBookRatio) || 0,
      roe: Number(ov.ReturnOnEquityTTM) || 0,
      roa: Number(ov.ReturnOnAssetsTTM) || 0,
      profitMargin: Number(ov.ProfitMargin) || 0,
      percentInsiders: Number(ov.PercentInsiders) || 0,
      percentInstitutions: Number(ov.PercentInstitutions) || 0,
      fiftyTwoWeekHigh: Number(ov["52WeekHigh"]) || 0,
      fiftyTwoWeekLow: Number(ov["52WeekLow"]) || 0,
    },
    financials: {
      totalRevenue: Number(latestIncome.totalRevenue) || 0,
      netIncome: Number(latestIncome.netIncome) || 0,
      grossProfit: Number(latestIncome.grossProfit) || 0,
      totalAssets: Number(latestBalance.totalAssets) || 0,
      totalLiabilities: Number(latestBalance.totalLiabilities) || 0,
      totalDebt: Number(latestBalance.shortLongTermDebtTotal) || 0,
    },
    lastUpdated: new Date(),
  };

  // Upsert in DB
  const updatedStock = await StockDetail.findOneAndUpdate(
    { symbol: symbol },
    stockPayload,
    { upsert: true, new: true }
  );

  console.log(`[SYNC COMPLETE] ${symbol} saved successfully.`);
  return updatedStock;
};

// Single Stock Sync Route Handler
// const syncStockFundamentals = async (req, res) => {
//   const { symbol } = req.body;
//   if (!symbol) {
//     return res.status(400).json({ success: false, message: "Stock symbol is required" });
//   }

//   try {
//     const data = await fetchAndSaveSingleStock(symbol);
//     res.status(200).json({
//       success: true,
//       message: `Stock fundamentals synced successfully for ${symbol}`,
//       data,
//     });
//   } catch (error) {
//     console.error("Single Sync Error:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// Batch Sync Multiple Stocks (Background Execution)
const syncBatchStocks = async (req, res) => {
  const stockList = req.body.symbols || DEFAULT_INDIAN_STOCKS;

  // Immediate response taaki HTTP Request timeout na ho
  res.status(200).json({
    success: true,
    message: `Batch sync started in background for ${stockList.length} stocks.`,
    symbols: stockList,
  });

  // Async loop in background
  for (const symbol of stockList) {
    try {
      await fetchAndSaveSingleStock(symbol);
      await sleep(13000); // Wait 13 sec before starting next stock
    } catch (err) {
      console.error(`[BATCH ERROR] Failed for ${symbol}:`, err.message);
    }
  }

  console.log("\n===================================");
  console.log("[ALL BATCH SYNCS COMPLETED]");
};

// GET All Stocks for Frontend
const getAllStockDetails = async (req, res) => {
  try {
    const stocks = await StockDetail.find().sort({ "fundamentals.marketCap": -1 });
    res.status(200).json({ success: true, count: stocks.length, data: stocks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  // syncStockFundamentals,
  syncBatchStocks,
  getAllStockDetails,
};