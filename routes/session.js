// dependencies
const express = require('express');

const router = express.Router();

const upload = require('../config/multer');
const {
  setSession,
  getSessions,
  getMentorSessions,
  singleSession,
  deleteSession,
  modifySession,
} = require('../controllers/session');
const { auth } = require('../controllers/auth');

// upload session
router.post('/', auth.authorize, upload.single('photo'), setSession); // photo name to be provided from frontend

// get all sessions
router.get('/', getSessions);

// get all individual mentor's sessions
router.get('/mentor/', getMentorSessions);

// get single session
router.get('/session', singleSession);

// delete single session
router.delete('/delete', auth.authorize, deleteSession);

// update a session
router.post('/update', auth.authorize, modifySession);

module.exports = router;
