const mongoose = require('mongoose');

const CourseTrainer = require('../models/course_trainer');

// Creating a new course-trainer relationship
CourseTrainer.create = async (relationship) => {
  try { 
    // saving the relationship
    const courseTrainer = new CourseTrainer(relationship); 
    //eg. relationship = { course: "5db6b26730f133b65dbbe459", trainer: "23b65dbbe45db6b27530f13a"} 
    await courseTrainer.save();
    return { success: 'CourseTrainer profile successfully created' };
  } catch (err) {
    return {error: err.message || 'An error occured while creating new course-trainer relationship'};
  }
}; 

// Retrieve all course-trainer relationships
CourseTrainer.readAll = async () => {
  try {
    const data = await CourseTrainer.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve all course-trainer relationships'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving course-trainer relationships '};
  }
};

// Retrieve one course-trainer relationship
CourseTrainer.readOne = async (relationship) => {
  try {
    const data = await CourseTrainer.findOne()
    .where('trainer').equals(relationship.trainer)
    .where('course').equals(relationship.course)
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve a relationship btn trainer and course'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this course-trainer relationship'};
  }
};

module.exports = { CourseTrainer };



