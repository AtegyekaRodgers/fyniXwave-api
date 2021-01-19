const express = require('express');
const { Disciplines } = require('../controllers/disciplines');
const { auth } = require('../controllers/auth');

const router = express.Router();

// Create discipline
router.post('/', auth.authorize, Disciplines.create);

// Add tags to a discipline
router.put('/', auth.authorize, Disciplines.addKeywords);

// Get all disciplines
router.get('/', auth.authorize, Disciplines.read);

// Get a discipline
router.get('/:id', auth.authorize, Disciplines.readOne);

module.exports = router;
