// dependencies
const express = require('express');

const router = express.Router();

const upload = require('../config/multer');
const { setSession, getSessions } = require('../controllers/session');

// upload session get route
router.get('/', getSessions);

// upload session post route
router.post('/', upload.single('photo'), setSession);// photo name to be provided from frontend

module.exports = router;
