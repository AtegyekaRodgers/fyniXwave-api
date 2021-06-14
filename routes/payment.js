
const express = require('express');
const { Payment } = require('../controllers/payment');

const router = express.Router();

// recording a new payment
router.post('/', Payment.create);

// Retrieve all payment records
router.get('/', Payment.readAll);

// Retrieve a specific payment
router.get('/:payment_id', Payment.readOne);


// Retrieve payments by a particular member and for a particular loan
router.get('/filtered/:memberId/:loanId', Payment.readByMember);

module.exports = router;


