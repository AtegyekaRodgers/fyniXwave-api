const cloudinary = require('../config/cloudinary');
const Content = require('../models/contentModel');

exports.uploadFile = async (req, res) => {
  try {
    // Upload files to cloudinary
    const result = await cloudinary.uploader.upload(
      req.file.path,
      { resource_type: 'auto' },
      (error) => {
        if (error) console.log(error);
      },
    );
    // Generating an array of tags
    const tags = req.body.tags.split(',').map(String);
    // Create new content
    const content = new Content({
      userID: req.userID,
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      tags,
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

// Get individual mentor's content
exports.mentorFiles = async (req, res) => {
  try {
    const content = await Content.find(
      { userID: req.userID },
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
      message:
        err.message || 'An error occured while retrieving mentor content',
    });
    console.log(err);
  }
};

// Get all content
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
      message: err.message || 'An error occured while retrieving all content',
    });
    console.log(err);
  }
};

// delete content route
exports.deleteFile = async (req, res) => {
  try {
    // Find content by id
    const content = await Content.findById(req.query.id);
    if (content.userID !== req.userID) {
      res.status(403).json({
        message: 'Content can only be deleted by the owner',
      });
    }
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

// retrieve single content
exports.singleContent = async (req, res) => {
  try {
    const content = await Content.findById(req.query.id);
    res.json(content);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this content',
    });
    console.log(err);
  }
};

exports.modifyFile = async (req, res) => {
  try {
    let content = await Content.findById(req.query.id);
    if (content.userID !== req.userID) {
      res.status(403).json({
        message: 'Content can only be modified by the owner',
      });
    }
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
    content = await Content.findByIdAndUpdate(req.query.id, data, {
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

exports.searchContentByTags = async (tags) => {
  try {
    const contents = await Content.find(
      {
        $and: [{ tags: { $in: tags } }],
      },
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
    ).sort({ modifiedAt: -1 });
    return contents;
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.getRelatedContent = async (req, res) => {
  try {
    const { tags } = await Content.findById(req.params.contentId, {
      tags: 1,
    });
    const relatedContent = await this.searchContentByTags(tags);
    res.status(200).json(relatedContent);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || 'Error getting related content',
    });
  }
};
