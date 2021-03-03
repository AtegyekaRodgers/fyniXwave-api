
const express = require('express');
const { Certificate } = require('../controllers/certificate');
const { auth } = require('../controllers/auth');

const router = express.Router();

// Define a new certificate
router.post('/', Certificate.create);

// Retrieve certificates
router.get('/', Certificate.readAll);

module.exports = router;


