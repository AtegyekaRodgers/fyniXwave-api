
const express = require('express');
const { Payment } = require('../controllers/payment');
const { auth } = require('../controllers/auth');

const router = express.Router();

// Save a new payment
router.post('/', Payment.create);

// Retrieve payment records
router.get('/', Payment.readAll);

module.exports = router;


