// dependencies
const express = require('express');

const router = express.Router();

const upload = require('../config/multer');
const { getFile, uploadFile, mentorFiles } = require('../controllers/contentController');

// upload content post route
router.post('/', upload.single('content'), uploadFile);// content name to be provided from frontend

// Get all content
router.get('/', getFile);

// Get mentor's content
router.post('/mentor', mentorFiles);

module.exports = router;
