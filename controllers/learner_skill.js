const mongoose = require('mongoose');

const LearnerSkill = require('../models/learner_skill');

// Creating a new learner-skill relationship
LearnerSkill.create = async (relationship, cback) => {
  try {
    // saving the relationship
    const learnerSkill = new LearnerSkill(relationship); 
    //eg. relationship = { skill: "5db6b26730f133b65dbbe459", learner: "23b65dbbe45db6b27530f13a"} 
    let feedback = null;
    await learnerSkill.save((err,lrnrskill) => {
        if(err){ 
            console.log("await learnerSkill.save(...):  error = ", err);    
            feedback = {error: err.message || 'Failed to create new learner-skill relationship'};
            cback(feedback);
            return;
        } 
        console.log("await learnerSkill.save(...): success, lrnrskill = ", lrnrskill);
        feedback = {success: 'Learner-skill relationship successfully created'};
        cback(feedback); 
    }); 
  } catch (err) {
    console.log("LearnerSkill.create: .catch error ", err);
    let feedback = {error: err.message || 'An error occured while creating new learner-skill relationship'};
    cback(feedback);
  }
}; 

// Retrieve all learner-skill relationships
LearnerSkill.readAll = async () => {
  try {
    const data = await LearnerSkill.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve all learner-skill relationships'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving learner-skill relationships '};
  }
};

// Retrieve one learner-skill relationship
LearnerSkill.readOne = async (relationship) => {
  try {
    const data = await LearnerSkill.findOne()
    .where('learner').equals(relationship.learner)
    .where('skill').equals(relationship.skill)
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve a relationship btn learner and course'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this learner-skill relationship'};
  }
};

module.exports = { LearnerSkill };



