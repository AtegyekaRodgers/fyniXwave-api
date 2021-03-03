const express = require('express');
const { Disciplines } = require('../controllers/disciplines');
const { auth } = require('../controllers/auth');

const router = express.Router();

// Create discipline
router.post('/', Disciplines.create);

// Add tags to a discipline
router.put('/', Disciplines.addKeywords);

// Get all disciplines
router.get('/', Disciplines.read);

// Get a discipline
router.get('/:id', Disciplines.readOne);

module.exports = router;
