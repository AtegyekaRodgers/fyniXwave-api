const cloudinary = require("../configurations/cloudinary");
const Content = require("../models/contentModel"); 

exports.uploadFile = async (req, res) => {
    try {
        // Upload files to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
           // Create new content
          let content = new Content({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            rating: req.body.rating,
            cloudinaryFileLink: result.secure_url,
            cloudinaryId: result.public_id,
            createdAt:Date.now(),
            modifiedAt:Date.now()
          });
          // Save content
          await content.save();
          res.json(content);
        } catch (err) {
          console.log(err);
    }}

  //content get route
    exports.getFile = async(req,res) => {
      
        try {
          let content = await Content.find();
          res.json(content);
        } catch (err) {
          res.status(500).send({
            message: err.message || 'An error occured while retrieving contents',
          });
          console.log(err);
        }
      };