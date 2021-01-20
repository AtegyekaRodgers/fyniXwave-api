const express = require('express');
const { index } = require('../controllers/index');

const router = express.Router();

// Initial route
router.get('/', index.defaultFeed);

// Retrieve a single user with userId
router.get('/:userId', index.userFeed);

module.exports = router;
