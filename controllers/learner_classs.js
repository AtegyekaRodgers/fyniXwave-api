const mongoose = require('mongoose');

const LearnerClasss = require('../models/learner_classs');

// Creating a new learner-classs relationship
LearnerClasss.create = async (relationship) => {
  try { 
    // saving the relationship
    const learnerSkill = new LearnerClasss(relationship); 
    //eg. relationship = { classs: "5db6b26730f133b65dbbe459", learner: "23b65dbbe45db6b27530f13a"} 
    await learnerSkill.save();
    return { success: 'LearnerClasss profile successfully created' };
  } catch (err) {
    return {error: err.message || 'An error occured while creating new learner-classs relationship'};
  }
}; 

// Retrieve all learner-classs relationships
LearnerClasss.readAll = async () => {
  try {
    const data = await LearnerClasss.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve all learner-classs relationships'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving learner-classs relationships '};
  }
};

// Retrieve one learner-classs relationship
LearnerClasss.readOne = async (relationship) => {
  try {
    const data = await LearnerClasss.findOne()
    .where('learner').equals(relationship.learner)
    .where('classs').equals(relationship.classs)
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve a relationship btn learner and course'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this learner-classs relationship'};
  }
};

module.exports = { LearnerClasss };



