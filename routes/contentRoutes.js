// dependencies
const express = require('express');

const router = express.Router();

const upload = require('../config/multer');
const { getFile, uploadFile } = require('../controllers/contentController');

// upload content get route
router.get('/', getFile);

// upload content post route
router.post('/', upload.single('content'), uploadFile);// content name to be provided from frontend

module.exports = router;
