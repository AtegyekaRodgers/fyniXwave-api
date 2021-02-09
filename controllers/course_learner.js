const mongoose = require('mongoose');

const CourseLearner = require('../models/course_learner');

// Creating a new course-learner relationship
CourseLearner.create = async (relationship) => {
  try { 
    // saving the relationship
    const courseLearner = new CourseLearner(relationship); 
    //eg. relationship = { course: "5db6b26730f133b65dbbe459", learner: "23b65dbbe45db6b27530f13a"} 
    await courseLearner.save();
    return { success: 'CourseLearner profile successfully created' };
  } catch (err) {
    return {error: err.message || 'An error occured while creating new course-learner relationship'};
  }
}; 

// Retrieve all course-learner relationships
CourseLearner.readAll = async () => {
  try {
    const data = await CourseLearner.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve all course-learner relationships'}; }
        return datta;
    });
    return {data: datta};
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
    return {data: datta};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this course-learner relationship'};
  }
};

module.exports = { CourseLearner };



