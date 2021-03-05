const mongoose = require('mongoose');

const LearnerClasss = require('../models/learner_classs');

// Creating a new learner-classs relationship
LearnerClasss.create = async (relationship, cback) => {
  try {
    // saving the relationship
    const learnerClasss = new LearnerClasss(relationship); 
    //eg. relationship = { classs: "5db6b26730f133b65dbbe459", learner: "23b65dbbe45db6b27530f13a"} 
    let feedback = null;
    await learnerClasss.save((err,lrnrcls) => {
        if(err){ 
            console.log("await learnerClasss.save(...):  error = ", err);    
            feedback = {error: err.message || 'Failed to create new learner-class relationship'};
            cback(feedback);
            return;
        } 
        console.log("await learnerClasss.save(...): success, lrnrcls = ", lrnrcls);
        feedback = {success: 'Learner-class relationship successfully created'};
        cback(feedback); 
    }); 
  }catch (err) {
    console.log("LearnerClasss.create: .catch error ", err);
    let feedback = {error: err.message || 'An error occured while creating new learner-class relationship'};
    cback(feedback);
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



