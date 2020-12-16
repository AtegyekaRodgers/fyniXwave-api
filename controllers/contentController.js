const cloudinary = require('../config/cloudinary');
const Content = require('../models/contentModel');

exports.uploadFile = async (req, res) => {
  try {
    // Upload files to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    // Create new content
    const content = new Content({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      category: req.body.category,
      cloudinaryFileLink: result.secure_url,
      cloudinaryId: result.public_id,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    });
    // Save content
    await content.save();
    res.json(content);
  } catch (err) {
    console.log(err);
  }
};

// content get route
exports.getFile = async (req, res) => {
  try {
    const content = await Content.find(
      {},
      {
        title: 1,
        author: 1,
        description: 1,
        category: 1,
        cloudinaryId: 1,
        createdAt: 1,
        modifiedAt: 1,
      },
    ).sort({ createdAt: -1 });
    res.json(content);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving contents',
    });
    console.log(err);
  }
};

// content get route
exports.getFile = async (req, res) => {
  try {
    const content = await Content.find(
      {},
      {
        title: 1,
        author: 1,
        description: 1,
        category: 1,
        cloudinaryFileLink: 1,
        cloudinaryId: 1,
        createdAt: 1,
        modifiedAt: 1,
      },
    ).sort({ createdAt: -1 });
    res.json(content);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving contents',
    });
    console.log(err);
  }
};

// delete content route
exports.deleteFile = async (req, res) => {
  try {
    // Find content by id
    const content = await Content.findById(req.params.id);
    // Delete content from cloudinary
    await cloudinary.uploader.destroy(content.cloudinaryId);
    // Delete content from db
    await content.remove();
    res.json(content);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while deleting content',
    });
    console.log(err);
  }
};

exports.modifyFile = async (req, res) => {
  try {
    let content = await Content.findById(req.params.id);
    // Delete content from cloudinary
    await cloudinary.uploader.destroy(content.cloudinaryId);
    // Upload content to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    const data = {
      title: req.body.title || content.title,
      author: req.body.author || content.author,
      description: req.body.description || content.description,
      category: req.body.category || content.category,
      cloudinaryFileLink: result.secure_url || content.cloudinaryFileLink,
      cloudinaryId: result.public_id || content.cloudinaryId,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    content = await Content.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json(content);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while updating content',
    });
    console.log(err);
  }
};
