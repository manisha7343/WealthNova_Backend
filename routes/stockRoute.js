const express = require("express");
const router = express.Router();

const {
  syncStockFundamentals,
  fetchAndSaveBatchStock,
  getAllStockDetails,
} = require("../controllers/stockDetailController");

router.post("/single-stock", syncStockFundamentals);
router.post("/batch-stock", fetchAndSaveBatchStock);
router.get("/fundamentals", getAllStockDetails);

module.exports = router;