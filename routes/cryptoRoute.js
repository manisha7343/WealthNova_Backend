const express = require('express');
const router = express.Router();
const { getCryptoPulse, upsertCrypto } = require('../controllers/cryptoController');

router.get('/', getCryptoPulse);
router.post('/upsert', upsertCrypto);

module.exports = router;
