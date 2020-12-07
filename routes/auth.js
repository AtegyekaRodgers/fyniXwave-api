const express = require('express');
const { auth } = require('../controllers/auth.js');

const router = express.Router();

// Login post request
router.post('/login', auth.login);

// Logout get request
router.get('/logout', auth.logout);

// Reset Password post request
router.post('/resetpassword', auth.resetPassword);

module.exports = router;
