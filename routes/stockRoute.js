const express = require("express");
const router = express.Router();

const {
  syncSingleStock,
  fetchAndSaveBatch,
  manualAddStock
} = require("../controllers/stockDetailController");

// ==========================================
// DB DUMP / SYNC ROUTES
// ==========================================

// 1. Single Stock Sync with optional force refresh 
// POST http://localhost:5000/api/stocks/sync/ICICIBANK
// POST http://localhost:5000/api/stocks/sync/ICICIBANK?force=true
router.post("/sync/:symbol", syncSingleStock);

// 2. Batch Sync for multiple symbols
// POST http://localhost:5000/api/stocks/sync-batch
router.post("/sync-batch", fetchAndSaveBatch);



router.post("/manual-add", manualAddStock);

module.exports = router;