
const express = require('express');
const { Activity } = require('../controllers/activity');
const { auth } = require('../controllers/auth');

const router = express.Router();

// Save a new activity log
router.post('/', Activity.create);

// Retrieve activity logs
router.get('/', auth.authorize, Activity.readAll);

module.exports = router;


