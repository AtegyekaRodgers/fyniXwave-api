const mongoose = require('mongoose');

const Institution = require('../models/institution');

// Creating a new institution profile
Institution.create = async (req, res) => {
    /* req.body = 
    {
       institutionName: "...",
       location: "...",
       alumniGroup: "..." //key 
    }
    */ 
  
  try {
    // saving the profile
    const institution = new Institution(req.body);
    await institution.save();
    res.status(201).json({ message: 'Institution profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new institution profile',
    });
  }
};

// Adding or updating profile picture for an institution
Institution.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let institution = await Institution.findById(req.query.id);
    const updated = await Institution.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || institution.profilePicture, cloudinaryId: result.public_id },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all institutions
Institution.readAll = async (req, res) => {
  try {
    const institutions = await Institution.find();
    res.status(200).json(institutions);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving institutions',
    });
  }
};

// Retrieve single institution
Institution.readOne = async (req, res) => {
  try {
    const institution = await Institution.findById(req.query.id);
    res.json(institution);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this institution',
    });
    console.log(err);
  }
};

module.exports = { Institution };



