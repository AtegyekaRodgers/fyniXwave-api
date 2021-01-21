const express = require('express');
const { index } = require('../controllers/index');

const router = express.Router();

// Default feed
router.get('/', index.feed);

// Searching
router.get('/search', index.search);

module.exports = router;
