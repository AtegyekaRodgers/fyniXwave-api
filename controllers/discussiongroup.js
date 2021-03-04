const mongoose = require('mongoose');

const DiscussionGroup = require('../models/discussiongroup');

// Creating a new discussionGroup profile
DiscussionGroup.create = async (req, res) => {
    /* req.body = 
    {
        
    }
    */ 
  
  try {
    // saving the profile
    const discussionGroup = new DiscussionGroup(req.body);
    await discussionGroup.save();
    res.status(201).json({ message: 'DiscussionGroup profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new discussionGroup profile',
    });
  }
};

// Adding or updating profile picture for a discussionGroup
DiscussionGroup.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let discussionGroup = await DiscussionGroup.findById(req.query.id);
    const updated = await DiscussionGroup.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || discussionGroup.profilePicture, cloudinaryId: result.public_id },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all discussionGroups
DiscussionGroup.readAll = async (req, res) => {
  try {
    const discussionGroups = await DiscussionGroup.find();
    res.status(200).json(discussionGroups);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving discussionGroups',
    });
  }
};

// Retrieve single discussionGroup
DiscussionGroup.readOne = async (req, res) => {
  try {
    const discussionGroup = await DiscussionGroup.findById(req.query.id);
    res.json(discussionGroup);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this discussionGroup',
    });
    console.log(err);
  }
};

module.exports = { DiscussionGroup };



