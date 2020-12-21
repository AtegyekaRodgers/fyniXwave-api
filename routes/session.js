// dependencies
const express = require('express');

const router = express.Router();

const upload = require('../config/multer');
const {
  setSession, getSessions, getMentorSessions, singleSession, deleteSession,
} = require('../controllers/session');

// upload session
router.post('/', upload.single('photo'), setSession);// photo name to be provided from frontend

// get all sessions
router.get('/', getSessions);

// get all individual mentor's sessions
router.get('/mentor/', getMentorSessions);

// get single session
router.get('/:id', singleSession);

// delete single session
router.delete('/:id', deleteSession);

module.exports = router;
