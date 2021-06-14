// dependencies
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

// setup cloudary library object
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// export function
exports.uploads = (file, folder) => new Promise((resolve) => {
  cloudinary.uploader.upload(file, (result) => {
    // result
    resolve({
      url: result.url,
      id: result.public_id,
    });
  }, {
    resource_type: 'auto',
    // initialize the uploads folder property
    folder,
  });
});
