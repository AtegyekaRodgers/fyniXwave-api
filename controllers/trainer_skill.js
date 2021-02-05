const mongoose = require('mongoose');

const TrainerSkill = require('../models/trainer_skill');

// Creating a new trainer-skill relationship
TrainerSkill.create = async (relationship) => {
  try { 
    // saving the relationship
    const trainerSkill = new TrainerSkill(relationship); 
    //eg. relationship = { trainer: "5db6b26730f133b65dbbe459", skill: "23b65dbbe45db6b27530f13a"} 
    await trainerSkill.save();
    return { success: 'TrainerSkill profile successfully created' };
  } catch (err) {
    return {error: err.message || 'An error occured while creating new trainer-skill relationship'};
  }
}; 

// Retrieve all trainer-skill relationships
TrainerSkill.readAll = async () => {
  try {
    const data = await TrainerSkill.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve all trainer-skill relationships'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving trainer-skill relationships '};
  }
};

// Retrieve one trainer-skill relationship
TrainerSkill.readOne = async (relationship) => {
  try {
    const data = await TrainerSkill.findOne()
    .where('skill').equals(relationship.skill)
    .where('trainer').equals(relationship.trainer)
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve a relationship btn skill and trainer'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this trainer-skill relationship'};
  }
};

module.exports = { TrainerSkill };



