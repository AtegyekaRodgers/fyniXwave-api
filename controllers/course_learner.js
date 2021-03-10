const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId

const CourseLearner = require('../models/course_learner');

// Creating a new course-learner relationship
CourseLearner.create = async (relationship, cback) => {
  try {
    // saving the relationship
    if (!relationship.course || !relationship.learner || !ObjectId.isValid(relationship.course) || !ObjectId.isValid(relationship.learner)){
        throw "!! CourseLearner.create reeceived invalid arguments.";
    }
    const courseLearner = new CourseLearner(relationship); 
    //eg. relationship = { course: "5db6b26730f133b65dbbe459", learner: "23b65dbbe45db6b27530f13a"} 
    let feedback = null;
    await courseLearner.save((err,crslrnr) => {
        if(err){ 
            console.log("await courseLearner.save(...):  error = ", err);    
            feedback = {error: err.message || 'Failed to create new institution-learner relationship'};
            cback(feedback);
            return;
        } 
        console.log("await courseLearner.save(...): success, crslrnr = ", crslrnr);
        feedback = {success: 'Institution-learner relationship successfully created'};
        cback(feedback); 
    }); 
  } catch (err) {
    console.log("CourseLearner.create: .catch error ", err);
    let feedback = {error: err.message || 'An error occured while creating new institution-learner relationship'};
    cback(feedback);
  }
}; 

// Retrieve all course-learner relationships
CourseLearner.readAll = async () => {
  try {
    const data = await CourseLearner.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve all course-learner relationships'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving course-learner relationships '};
  }
};

// Retrieve one course-learner relationship
CourseLearner.readOne = async (relationship) => {
  try {
    const data = await CourseLearner.findOne()
    .where('learner').equals(relationship.learner)
    .where('course').equals(relationship.course)
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve a relationship btn learner and course'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this course-learner relationship'};
  }
};

module.exports = { CourseLearner };



