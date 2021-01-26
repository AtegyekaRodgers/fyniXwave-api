const multer = require('multer');

// specify the storage engine
const storage = multer.storage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  // creating arandom name attached to the file uploaded
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// file validation
const fileFilter = (req, file, cb) => {
  if (
    ext !== '.jpg'
    && ext !== '.jpeg'
    && ext !== '.png'
    && ext !== '.jpg'
    && ext !== '.pdf'
    && ext !== '.xls'
    && ext !== '.xlsx'
    && ext !== '.doc'
    && ext !== '.docx'
    && ext !== '.ppt'
    && ext !== '.pptx'
    && ext !== '.odt'
    && ext !== '.ods'
  ) {
    cb(null, true);
  } else {
    // not mime type file
    cb({ message: 'unsupported file format' }, false);
  }
};

// attach storage and filefilter
const upload = multer({
  storage,
  limits: { fileSize: 800000 },
  fileFilter,
});
module.exports = upload;
