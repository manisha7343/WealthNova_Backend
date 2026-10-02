const express = require("express");
const router = express.Router();

const {
  manualAddStock,
  searchStocks,
  // getMarketData yahan se hata diya kyunki ab alag route ban gaya hai
} = require("../controllers/stockDetailController");

// MANUAL STOCK ADD ROUTE
router.post("/manual-add", manualAddStock);

// SEARCH STOCKS ROUTE (FOR WATCHLIST)
router.get("/search", searchStocks);

module.exports = router;