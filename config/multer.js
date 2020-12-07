const multer = require('multer');
const path = require('path');
// Multer config
module.exports = multer({
  // specify storage
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    // file validation
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.pdf') {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
});
