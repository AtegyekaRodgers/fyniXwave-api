// dependencies
const express = require('express');

const router = express.Router();

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

// upload content post route
router.post('/', upload.single('content'), uploadFile);

// Get all content
router.get('/', getFile);

// Get mentor's content
router.get('/mentor', mentorFiles);

// retrieve single content
router.get('/content', singleContent);

// delete content
router.delete('/delete', deleteFile);

// update content
router.put('/update', modifyFile);

// Get related content
router.get('/relatedContent/:contentId', getRelatedContent);

module.exports = router;
