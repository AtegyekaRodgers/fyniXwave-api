const mongoose = require('mongoose');

const CourseSkill = require('../models/course_skill');

// Creating a new course-skill relationship
CourseSkill.create = async (relationship) => {
  try { 
    // saving the relationship
    const courseSkill = new CourseSkill(relationship); 
    //eg. relationship = { course: "5db6b26730f133b65dbbe459", skill: "23b65dbbe45db6b27530f13a"} 
    await courseSkill.save();
    return { success: 'CourseSkill profile successfully created' };
  } catch (err) {
    return {error: err.message || 'An error occured while creating new course-skill relationship'};
  }
}; 

// Retrieve all course-skill relationships
CourseSkill.readAll = async () => {
  try {
    const data = await CourseSkill.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve all course-skill relationships'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving course-skill relationships '};
  }
};

// Retrieve one course-skill relationship
CourseSkill.readOne = async (relationship) => {
  try {
    const data = await CourseSkill.findOne()
    .where('skill').equals(relationship.skill)
    .where('course').equals(relationship.course)
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve a relationship btn skill and course'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this course-skill relationship'};
  }
};

module.exports = { CourseSkill };



