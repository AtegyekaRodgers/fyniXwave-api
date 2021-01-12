const express = require('express');
const { Disciplines } = require('../controllers/disciplines');
const { auth } = require('../controllers/auth');

const router = express.Router();

// Create discipline
router.post('/', auth.authorize, Disciplines.create);

// Create discipline
router.get('/', auth.authorize, Disciplines.read);

// Create discipline
router.get('/:id', auth.authorize, Disciplines.readOne);

module.exports = router;
