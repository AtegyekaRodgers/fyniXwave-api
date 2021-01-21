const express = require('express');
const { home } = require('../controllers/home');
const { auth } = require('../controllers/auth');

const router = express.Router();

// User feed
router.get('/:id', auth.authorize, home.feed);

// // Dashboard
// router.get('/dashboard', auth.authorize, index.dashboard);

// // Searching
// router.get('/search', auth.authorize, index.search);

module.exports = router;
