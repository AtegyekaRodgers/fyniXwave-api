const mongoose = require('mongoose');

const JobSkill = require('../models/job_skill');

// Creating a new job-skill relationship
JobSkill.create = async (relationship, cback) => {
  try {
    // saving the relationship
    const jobSkill = new JobSkill(relationship); 
    //eg. relationship = { job: "5db6b26730f133b65dbbe459", skill: "23b65dbbe45db6b27530f13a"} 
    let feedback = null;
    await jobSkill.save((err,jbskl) => {
        if(err){ 
            console.log("await jobSkill.save(...):  error = ", err);    
            feedback = {error: err.message || 'Failed to create new job-skill relationship'};
            cback(feedback);
            return;
        } 
        console.log("await jobSkill.save(...): success, jbskl = ", jbskl);
        feedback = {success: 'Job-skill relationship successfully created'};
        cback(feedback); 
    }); 
  }catch (err) {
    console.log("JobSkill.create: .catch error ", err);
    let feedback = {error: err.message || 'An error occured while creating new job-skill relationship'};
    cback(feedback);
  }
}; 

// Retrieve all learner-classs relationships
JobSkill.readAll = async () => {
  try {
    const data = await JobSkill.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve all job-skill relationships'}; }
        data = datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving job-skill relationships '};
  }
};

// Retrieve one learner-classs relationship
JobSkill.readOne = async (relationship) => {
  try {
    const data = await JobSkill.findOne()
    .where('job').equals(relationship.job)
    .where('skill').equals(relationship.skill)
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve a relationship btn job and skill'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this job-skill relationship'};
  }
};

module.exports = { JobSkill };



