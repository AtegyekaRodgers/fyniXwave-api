const mongoose = require('mongoose');

const CourseTrainer = require('../models/course_trainer');

// Creating a new course-trainer relationship
CourseTrainer.create = async (relationship, cback) => {
  try {
    // saving the relationship
    const courseTrainer = new CourseTrainer(relationship); 
    //eg. relationship = { course: "5db6b26730f133b65dbbe459", trainer: "23b65dbbe45db6b27530f13a"} 
    let feedback = null;
    await courseTrainer.save((err, crstrnr) => {
        if(err){
            console.log("await courseTrainer.save(...):  error = ", err);    
            feedback = {error: err.message || 'Failed to create new course-trainer relationship'};
            cback(feedback);
            return;
        } 
        console.log("await courseTrainer.save(...): success, crstrnr = ", crstrnr);
        feedback = {success: 'Course-Trainer relationship successfully created'};
        cback(feedback); 
    }); 
  }catch (err) {
    console.log("CourseTrainer.create: .catch error ", err);
    let feedback = {error: err.message || 'An error occured while creating new course-trainer relationship'};
    cback(feedback);
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



