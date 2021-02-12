const mongoose = require('mongoose');

const SkillingSession = require('../models/skilling_session');

// Creating a new skilling_session record
SkillingSession.create = async (req, res) => {
/* req.body =
{
    sessionTitle: "...",
    sessionDate: "continuous",
    weekDays: ["Monday","Wednesday","Thursday"],
    presenter: "...", //trainer _id
    description: "...",
    tags: ["...", "...", "..."],
    startTime: "...",
    endTime: "...",
    ongoing: false,
    parentClasss: "...",
    parentInstitution: "...",
    sessionAddressLink: "https://zoom-meeting-invite-link/?room-id",
    modifiedAt: '17/02/2021',
  }
*/ 
  try {
    // saving the profile
    const skillingSession = new SkillingSession(req.body);
    await skillingSession.save();
    res.status(201).json({ message: 'SkillingSession profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new skillingSession profile',
    });
  }
};

// Adding or updating profile picture for an skillingSession
SkillingSession.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let skillingSession = await SkillingSession.findById(req.query.id);
    const updated = await SkillingSession.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || skillingSession.profilePicture, cloudinaryId: result.public_id },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all skillingSessions
SkillingSession.readAll = async (req, res) => {
  try {
    const skillingSessions = await SkillingSession.find();
    res.status(200).json(skillingSessions);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving skillingSessiones',
    });
  }
};

// Retrieve all skillingSessions for a specific institution
SkillingSession.readAllByInstitution = async (institution_id) => {
  try {
    const data = await SkillingSession.find()
    .where('parentInstitution').equals(institution_id) 
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve skilling sessions for this institution'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving skilling sessions for this institution'};
  }
};

// Retrieve all skillingSessions for a specific classs
SkillingSession.readAllByInstitution = async (classs_id) => {
  try {
    const data = await SkillingSession.find()
    .where('parentClasss').equals(classs_id) 
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve skilling sessions for this class'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving skilling sessions for this class'};
  }
};

// Retrieve one skillingSession
SkillingSession.readOne = async (req, res) => {
  try {
    const skillingSession = await SkillingSession.findById(req.query.id);
    res.json(skillingSession);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this skillingSession',
    });
    console.log(err);
  }
};

module.exports = { SkillingSession };



