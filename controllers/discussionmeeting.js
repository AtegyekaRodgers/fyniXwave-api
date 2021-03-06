const mongoose = require('mongoose');

const DiscussionMeeting = require('../models/discussionmeeting');

// Creating a new discussionMeeting profile
DiscussionMeeting.create = async (req, res) => {
    /* req.body = 
    {
        "disMeetingName": "...",
        "remote": true, //can also be false in case the meeting should be physical
        "venue": "...",
        "theme": "......",
        "sponsoredBy": [], //optional
        "startDate": "...",
        "startTime": "...",
        "duration": "2 hours", //optional
        "parentGroup": "...", //must be a valid group id
        "meetingLink": "..."  //url link to external meeting platform such as zoom
    }
    */ 
  
  try {
    // saving the profile
    const discussionMeeting = new DiscussionMeeting(req.body);
    await discussionMeeting.save();
    res.status(201).json({ message: 'Discussion meeting successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new discussion meeting',
    });
  }
};

// Adding or updating profile picture for a discussionMeeting
DiscussionMeeting.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let discussionMeeting = await DiscussionMeeting.findById(req.query.id);
    const updated = await DiscussionMeeting.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || discussionMeeting.profilePicture, cloudinaryId: result.public_id },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all discussionMeetings
DiscussionMeeting.readAll = async (req, res) => {
  try {
    const discussionMeetings = await DiscussionMeeting.find();
    res.status(200).json(discussionMeetings);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving discussionMeetings',
    });
  }
};

// Retrieve single discussionMeeting
DiscussionMeeting.readOne = async (req, res) => {
  try {
    const discussionMeeting = await DiscussionMeeting.findById(req.query.id);
    res.json(discussionMeeting);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this discussionMeeting',
    });
    console.log(err);
  }
};

module.exports = { DiscussionMeeting };



