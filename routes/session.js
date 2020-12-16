// dependencies
const express = require('express');

const router = express.Router();

const upload = require('../config/multer');
const { setSession, getSessions, getMentorSessions } = require('../controllers/session');

// upload session
router.post('/', upload.single('photo'), setSession);// photo name to be provided from frontend

// get all sessions
router.get('/', getSessions);

// get all individual mentor's sessions
router.post('/mentor', getMentorSessions);

module.exports = router;
