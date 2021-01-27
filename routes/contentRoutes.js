const express = require('express');
const upload = require('../config/multer');
const {
  getFile,
  uploadFile,
  mentorFiles,
  singleContent,
  deleteFile,
  modifyFile,
  getRelatedContent,
} = require('../controllers/contentController');
const { auth } = require('../controllers/auth');

const router = express.Router();

// upload content post route
router.post('/', auth.authorize, upload.single('content'), uploadFile);

// Get all content
router.get('/', getFile);

// Get mentor's content
router.get('/mentor', mentorFiles);

// retrieve single content
router.get('/content', singleContent);

// delete content
router.delete('/delete', auth.authorize, deleteFile);

// update content
router.put('/update', auth.authorize, modifyFile);

// Get related content
router.get('/relatedContent/:contentId', getRelatedContent);

module.exports = router;
