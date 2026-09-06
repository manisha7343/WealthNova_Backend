// const cron = require("node-cron");
// const { fetchAndSaveSingleStock } = require("../controllers/stockDetailController");

// // Default Top Indian Companies to Auto-Sync
// const TOP_INDIAN_STOCKS = [
//   "RELIANCE.BSE",
//   "TCS.BSE",
//   "INFY.BSE",
//   "HDFCBANK.BSE",
//   "ICICIBANK.BSE",
//   "TATAMOTORS.BSE",
//   "SBIN.BSE",
//   "BHARTIARTL.BSE"
// ];

// // Helper delay (13 seconds)
// const sleep = (ms = 13000) => new Promise((resolve) => setTimeout(resolve, ms));

// // Schedule: Har raat 12:00 AM (0 0 * * *)
// const initMidnightSyncCron = () => {
//   cron.schedule("0 0 * * *", async () => {
//     console.log("==================================================");
//     console.log("[CRON JOB START] Starting Midnight Stock Fundamentals Sync...");

//     for (const symbol of TOP_INDIAN_STOCKS) {
//       try {
//         await fetchAndSaveSingleStock(symbol);
//         await sleep(13000); // 13 sec gap between stocks
//       } catch (err) {
//         console.error(`[CRON ERROR] Failed to sync ${symbol}:`, err.message);
//       }
//     }

//     console.log("[CRON JOB COMPLETE] All Indian Stocks Updated in DB.");
//     console.log("==================================================");
//   });
// };

// module.exports = initMidnightSyncCron;