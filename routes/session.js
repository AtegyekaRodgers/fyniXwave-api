// dependencies
const express = require('express');

const router = express.Router();

const upload = require('../config/multer');
const {
  setSession, getSessions, getMentorSessions, singleSession, deleteSession, modifySession,
} = require('../controllers/session');

// upload session
router.post('/', upload.single('photo'), setSession);// photo name to be provided from frontend

// get all sessions
router.get('/', getSessions);

// get all individual mentor's sessions
router.get('/mentor/', getMentorSessions);

<<<<<<< HEAD
//get single session
router.get('/session', singleSession);

//delete single session
router.delete('/delete', deleteSession);

//update a session
router.post('/update', modifySession);
=======
// get single session
router.get('/', singleSession);

// delete single session
router.delete('/', deleteSession);

// update a session
router.post('/', modifySession);
>>>>>>> 7c649cbec0da7df509e5c3acc14d668b84d1e8e4

module.exports = router;
