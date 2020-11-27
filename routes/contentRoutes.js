
//dependencies
const express = require('express')
const router = express.Router();

const upload = require('../configurations/multer')
const { uploadFile } = require('../controllers/contentController')
const { getFile } = require('../controllers/contentController')

//upload content get route
router.get("/", getFile);

//upload content post route
router.post('/',  upload.single('content'), uploadFile);//content name to be provided from frontend


module.exports = router;
