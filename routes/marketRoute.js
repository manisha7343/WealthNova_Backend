const express = require('express');
const router = express.Router();
const {
  getMarketData,
  getIndices,
  getGainersAndLosers,
  getMarketStocks,
  upsertMarketItem,
} = require('../controllers/MarketData');

router.get('/', getMarketData);
router.get('/indices', getIndices);
router.get('/stocks', getMarketStocks);
router.get('/gainers-losers', getGainersAndLosers);
router.post('/upsert', upsertMarketItem);

module.exports = router;