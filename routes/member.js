
const express = require('express');
const { Member } = require('../controllers/member');
const { Loan } = require('../controllers/loan');

const router = express.Router();

// Registering a new member
router.post('/', Member.create);

// Retrieve all members
router.get('/', Member.readAll);

// Retrieve a specific member
router.get('/:member_id', Member.readOne);


// Retrieve members for a particular member
router.post('/takeloan', Member.takeLoan, Loan.create);

module.exports = router;


