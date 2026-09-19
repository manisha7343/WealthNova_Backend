const express = require("express");
const router = express.Router();

const {
  manualAddStock,
} = require("../controllers/stockDetailController");

// ==========================================
// MANUAL STOCK ADD ROUTE
// ==========================================

// POST http://localhost:3002/api/stocks/manual-add
router.post("/manual-add", manualAddStock);

module.exports = router;