const mongoose = require('mongoose');

const Trainer = require('../models/trainer');
const Affiliation = require('../controllers/affiliation');
const TrainerSkill = require('../controllers/trainer_skill');

// Creating a new trainer profile
Trainer.create = async (req, res) => { 
  try { 
    // saving the profile
    let trnr = {
        trainerName: req.body.trainerName,
        discipline: req.body.discipline, 
        specialization: req.body.specialization,
        userId: req.body.userId
    };
    const trainer = new Trainer( trnr );
    await trainer.save(); 
     
    res.status(201).json({ message: 'Trainer profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new trainer profile',
    });
  }
};

// Create trainer-institution affiliation.
Trainer.attachInstitution = async (institution_id) => {
    //grab this trainer's id
    let trainer_id = this._id;
    
    //create a new institution-trainer relationship  
    let relationship = {institution: institution_id, affiliate: trainer_id, affiliateType: "trainer"};
    
    let returned = Affiliation.create(relationship);
    if(returned.error){ 
        console.log(returned.error);
        return false;
    }
    if(returned.success){
        console.log(returned.success);
        return true;
    }
};

// attach skills .
Trainer.attachSkill = async (skill_id) => {
    //grab this trainer's id
    let trainer_id = this._id;
    
    //create a new trainer-skill relationship  
    let relationship = {trainer: trainer_id, skill: skill_id};
    
    let returned = TrainerSkill.create(relationship);
    if(returned.error){ 
        console.log(returned.error);
        return false;
    }
    if(returned.success){
        console.log(returned.success);
        return true;
    }
};

// Adding or updating profile picture for an trainer
Trainer.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let trainer = await Trainer.findById(req.query.id);
    const updated = await Trainer.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || trainer.profilePicture },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all trainers
Trainer.readAll = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving trainers',
    });
  }
};

// Retrieve single trainer
Trainer.readOne = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.query.id);
    res.json(trainer);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this trainer',
    });
    console.log(err);
  }
};

module.exports = { Trainer };



