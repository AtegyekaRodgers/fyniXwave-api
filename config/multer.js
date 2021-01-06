const multer = require('multer');
const path = require('path');
// Multer config
module.exports = multer({
  // specify storage
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    // file validation
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.pdf' && ext !== '.WEBM' && ext !== '.MPG' && ext !== '.MP2' && ext !== '.MPEG' && ext !== '.MPE' && ext !== '.MPV' && ext !== '.OGG' 
    && ext !== '.MP4' && ext !== '.M4P' && ext !== '.M4V' && ext !== '.AVI' && ext !== '.WMV' && ext !== '.MOV' && ext !== '.FLV') {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
});
