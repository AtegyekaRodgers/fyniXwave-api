const mongoose = require('mongoose');

const Skill = require('../models/skill');

// Creating a new skill record
Skill.create = async (req, res) => {
  /* req.body = 
    {
       skillName: "...",
       discipline: "...",
       specialization: "...",
       profilePicture: "..."
    }
    */ 
  
  try { 
    // saving the profile
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json({ message: 'Skill profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new skill profile',
    });
  }
};

// Adding or updating profile picture for an skill
Skill.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let skill = await Skill.findById(req.query.id);
    const updated = await Skill.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || skill.profilePicture },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all skills
Skill.readAll = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving skills',
    });
  }
};

// Retrieve one skill
Skill.readOne = async (req, res) => {
  try {
    const skill = await Skill.findById(req.query.id);
    res.json(skill);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this skill',
    });
    console.log(err);
  }
};

module.exports = { Skill };



