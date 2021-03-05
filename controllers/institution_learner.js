const mongoose = require('mongoose');

const InstitutionLearner = require('../models/institution_learner');

// Creating a new institution-learner relationship
InstitutionLearner.create = async (relationship, cback) => {
  try {
    // saving the relationship
    const institutionLearner = new InstitutionLearner(relationship); 
    //eg. relationship = { institution: "5db6b26730f133b65dbbe459", learner: "23b65dbbe45db6b27530f13a"} 
    let feedback = null;
    await institutionLearner.save((err,inslrnr) => {
        if(err){ 
            console.log("await institutionLearner.save(...):  error = ", err);    
            feedback = {error: err.message || 'Failed to create new institution-learner relationship'};
            cback(feedback);
            return;
        } 
        console.log("await institutionLearner.save(...): success, inslrnr = ", inslrnr);
        feedback = {success: 'Institution-learner relationship successfully created'};
        cback(feedback); 
    }); 
  } catch (err) {
    console.log("InstitutionLearner.create: .catch error ", err);
    let feedback = {error: err.message || 'An error occured while creating new institution-learner relationship'};
    cback(feedback);
  }
}; 

// Retrieve all institution-learner relationships
InstitutionLearner.readAll = async () => {
  try {
    const data = await InstitutionLearner.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve all institutions-learners relationships'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving institution-learner relationships '};
  }
};

// Retrieve one institution-learner relationship
InstitutionLearner.readOne = async (relationship) => {
  try {
    const data = await InstitutionLearner.findOne()
    .where('institution').equals(relationship.institution)
    .where('learner').equals(relationship.learner)
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve a relationship btn institution and learner'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this institution-learner relationship'};
  }
};

module.exports = { InstitutionLearner };



