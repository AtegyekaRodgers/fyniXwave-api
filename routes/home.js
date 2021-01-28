const express = require('express');
const { home } = require('../controllers/home');
const { auth } = require('../controllers/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to delv api' });
});

// User feed
router.get('/feed', auth.authorize, home.feed);

// // Dashboard
// router.get('/dashboard', auth.authorize, index.dashboard);

// // Searching
// router.get('/search', auth.authorize, index.search);

module.exports = router;
