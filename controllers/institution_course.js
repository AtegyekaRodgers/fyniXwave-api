const mongoose = require('mongoose');

const InstitutionCourse = require('../models/institution_course');

// Creating a new institution-course relationship
InstitutionCourse.create = async (relationship, cback) => {
  try { 
    // saving the relationship
    const institutionCourse = new InstitutionCourse(relationship); 
    //eg. relationship = { institution: "5db6b26730f133b65dbbe459", course: "23b65dbbe45db6b27530f13a", courseCode: "BSE2098"} 
    let feedback = null;
    await institutionCourse.save((err,inscrs) => {
        if(err){ 
            console.log("await institutionCourse.save(...):  error = ", err);    
            feedback = {error: err.message || 'Failed to create new institution-course relationship'};
            cback(feedback);
            return;
        } 
        console.log("await institutionCourse.save(...): success, inscrs = ", inscrs);
        feedback = {success: 'Institution-Course relationship successfully created'};
        cback(feedback); 
    }); 
  } catch (err) {
    console.log("InstitutionCourse.create: .catch error ", err);
    let feedback = {error: err.message || 'An error occured while creating new institution-course relationship'};
    cback(feedback);
  }
};

// Retrieve all institution-course relationships
InstitutionCourse.readAll = async () => {
  try {
    const data = await InstitutionCourse.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve all institutions-courses relationships'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving institution-course relationships '};
  }
};

// Retrieve one institution-course relationship
InstitutionCourse.readOne = async (relationship) => {
  try {
    const data = await InstitutionCourse.findOne()
    .where('institution').equals(relationship.institution)
    .where('course').equals(relationship.course)
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve a relationship btn institution and course'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this institution-course relationship'};
  }
};

module.exports = { InstitutionCourse };



