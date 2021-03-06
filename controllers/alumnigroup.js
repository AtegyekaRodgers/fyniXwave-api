const mongoose = require('mongoose');

const Alumni = require('../models/alumnigroup');

// Creating a new alumni profile
Alumni.create = async (req, res) => {
    /* req.body = 
    {
        "groupName": "Delv alumni",
        "started": "01/01/2000",
        "parentInstitution": "603f8a84efc9d14364393f0a",
        "admins": ["603f47b30659d72147b9506a"]
    }
    */
  try {
    // saving the profile
    const alumni = new Alumni(req.body);
    await alumni.save();
    res.status(201).json({ message: 'Alumni group successfully created' });
  } catch (err) {
    res.status(500).json({message: err.message || 'An error occured while creating new alumni group'});
  }
};

// Adding or updating profile picture for an alumni
Alumni.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let alumni = await Alumni.findById(req.query.id);
    const updated = await Alumni.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || alumni.profilePicture, cloudinaryId: result.public_id },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all alumnis
Alumni.readAll = async (req, res) => {
  try {
    const alumnis = await Alumni.find();
    res.status(200).json(alumnis);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving alumnis',
    });
  }
};

// Retrieve single alumnus
Alumni.readOne = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.query.id);
    res.json(alumni);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retreiving this alumni',
    });
    console.log(err);
  }
};

module.exports = { Alumni };



