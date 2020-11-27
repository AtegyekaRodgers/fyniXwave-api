// // import dependencies
// const express = require('express');

// const router = express.Router();
// // require models

// // require content path
// const path = require('path');

// // multer for uploading
// const multer = require('multer');// for images
// // eslint-disable-next-line no-unused-vars
// const { extname } = require('path');
// const Content = require('../models/content');

// // specify storage
// const storage = multer.diskStorage({
//   // where to store files
//   destination: './public/content',
//   // appending on the content
//   filename(req, file, callback) {
//     callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// // init upload
// const upload = multer({
//   storage,
//   limit: { fileSize: 800000 },
//   filefilter: (req, file, callback) => {
//     checkFileType(file, this.call);
//   },
// });

// // check file type
// function checkFileType(file, callback) {
// // allowed extension
//   const filetypes = /pdf/;
//   // check extension
//   const extensionName = filetypes.test(path.extname(file.originalname));

//   // check mimetype
//   const mimetype = filetypes.test(file.mimetype);
//   if (mimetype && extensionName) {
//     return callback(null, true);
//   }
//   callback('Error: images only');
// }

// // retrieve content page

// router.get('/', (req, res) => {
//   res.send('content form');
// });

// router.post('/addcontent', async (req, res) => {
//   const content = new Content();
//   content.title = req.body.title;
//   content.author = req.body.author;
//   content.description = req.body.description;
//   content.content = req.body.content;
//   content.content = req.file.path;

//   try {
//     await content.save((error) => {
//       if (error) {
//         console.log(error);
//       }
//       res.redirect('/addcontent');
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// module.exports = router;
