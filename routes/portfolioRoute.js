const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPortfolio,
  addHolding,
  updateHolding,
  deleteHolding,
  bulkImport,
} = require("../controllers/portfolioController");

// All portfolio routes are protected for authenticated users
router.get("/", auth, getPortfolio);
router.post("/", auth, addHolding);
router.post("/bulk", auth, bulkImport);
router.put("/:id", auth, updateHolding);
router.delete("/:id", auth, deleteHolding);

module.exports = router;
