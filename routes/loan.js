
const express = require('express');
const { Loan } = require('../controllers/loan');

const router = express.Router();

// recording a new loan
router.post('/', Loan.create);

// Retrieve all loan records
router.get('/', Loan.readAll);

// Retrieve a specific loan
router.get('/:loan_id', Loan.readOne);

// Retrieve loans for a particular member
router.get('/filtered/:loan_id', Loan.readByMember);

module.exports = router;


