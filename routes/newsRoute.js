const express = require('express');
const router = express.Router();
const { getNewsData, addNews } = require('../controllers/newsController');

router.get('/', getNewsData);
router.post('/add', addNews);

module.exports = router;