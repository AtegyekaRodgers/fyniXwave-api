const mongoose = require('mongoose');

const DiscussionGroup = require('../models/discussiongroup');
const DiscussionGroupMembership =  require('../models/discussionGroup_membership');


// Creating a new discussionGroup profile
DiscussionGroup.create = async (req, res) => {
    /* req.body = 
    {
        "groupName": "...",
        "admins": ["603f47b30659d72147b9506a"]
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

DiscussionGroup.joingroup = async (req, res) => {
    /* req.body = 
    {
        "member": "...", //user id 
        "discussiongroup": "" //group id 
    }
    
    res.body = 
    {
      "message": "You have joined the discussion group",
      "membership_id": "..." //the new mebership id
    }
    */ 
  
  try {
    // saving the group
    const discussionGroupMembership = new DiscussionGroupMembership(req.body);
    await discussionGroupMembership.save((err, newMembership)=>{
        if(err){ res.status(201).send({ message: err.message || "Failed to register you to the group! Please try again"}); }
        res.status(201).send({ message: 'You have joined the discussion group', membership_id:(newMembership?newMembership._id:"") });
    }); 
  }catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating your membership to the discussion group profile',
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
      message: err.message || 'An error occured while retrieving you membership in discussion group',
    });
    console.log(err);
  }
};

module.exports = { DiscussionGroup };



