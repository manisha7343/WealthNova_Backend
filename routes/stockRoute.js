// routes/stockDetailRoutes.js
const express = require("express");
const router = express.Router();

const {
  // syncStockFundamentals,
  syncBatchStocks, // <-- Check 1: Controller import hona chahiye
  getAllStockDetails,
} = require("../controllers/stockDetailController"); // <-- Path sahi ho

// router.post("/sync-fundamentals", syncStockFundamentals);
router.post("/sync-batch", syncBatchStocks); // <-- Check 2: Ye line honi chahiye
router.get("/fundamentals", getAllStockDetails);

module.exports = router;