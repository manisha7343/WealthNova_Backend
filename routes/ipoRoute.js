const express = require('express');
const router = express.Router();
const { getIPOData, addOrUpdateIPO } = require('../controllers/ipoContoller');

router.get('/', getIPOData);
router.post('/add', addOrUpdateIPO);

module.exports = router;