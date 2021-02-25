const mongoose = require('mongoose');

const Classs = require('../models/classs');

// Creating a new classs record
Classs.create = async (req, res) => {
/* req.body = 
{
   classsName: "...",
   parentCourse: "..." //key
   parentInstitution: "...", //key, required
   startDate: "17/8/2021",
   endDate: "..."
}
*/ 
  try {
    // saving the profile
    const classs = new Classs(req.body);
    await classs.save();
    res.status(201).json({ message: 'Classs profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new classs profile',
    });
  }
};

// Adding or updating profile picture for an classs
Classs.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let classs = await Classs.findById(req.query.id);
    const updated = await Classs.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || classs.profilePicture, cloudinaryId: result.public_id },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all classses
Classs.readAll = async (req, res) => {
  try {
    const classses = await Classs.find();
    res.status(200).json(classses);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving classses',
    });
  }
};

// Retrieve all classses for a specific institution
Classs.readAllByInstitution = async (institution_id) => {
  try {
    const data = await Classs.find()
    .where('parentInstitution').equals(institution_id) 
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve classses for this institution'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving classses for this institution'};
  }
};

// Retrieve all classses for a specific course and institution
Classs.readAllByCourse = async (institution_id, course_id) => {
  try {
    const data = await Classs.find()
    .where('parentInstitution').equals(institution_id)
    .where('parentCourse').equals(course_id)
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve classses for this course'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving classses for this course'};
  }
};

// Retrieve one classs
Classs.readOne = async (req, res) => {
  try {
    const classs = await Classs.findById(req.query.id);
    res.json(classs);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this classs',
    });
    console.log(err);
  }
};

//Open this class
Classs.open = async (req, res) => {
  try {
    let attendenceList = { date:Date.now(), session_id:req.body.session_id, members:[]};
    const updatedClass = await Classs.findByIdAndUpdate( req.body.class_id, {$addToSet: {attendences: attendenceList}} );
    //TODO: retrieve the index of the new entry in updatedClass.attendences
    let newAttendenceListIndex = 0; //TODO: change this to the new index
    res.status(200).send({ success: "The class is now open.", listIndex:newAttendenceListIndex });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Failed to open this classs! please try again',
    });
    console.log(err);
  }
};

//Attend this class
Classs.attend = async (req, res) => {
    //is this a paid course ?
    try {
        if(parentCourseOfClasssIsPaid){
            //TODO: enforce payment
            //if user/learner paid, allow continuing
            
            //else, return and send an error message to user letting them know that they must pay
        }
    
        //describe the exact session that you want to attend 
        let user_id = req.body.user_id;
        let attendenceListIndex = req.body.list_index;
        //TODO: retrieve the attendences
        //TODO: pull out the exact attendence list
        //TODO: push the user_id to the list
        //TODO: write the list back to the array of attendence lists, replacing the old one
        res.status(200).send({ success: "Signed on the attendence list." });
      } catch (err) {
        res.status(500).send({ message: err.message || 'Failed to sign on the attendence list of the class'});
        console.log(err);
      } 
};

//end the classs before its predefined endDate
Classs.end = async (req, res) => {
/* req.body = 
{
   class_id: "...",
   parent_course_id: "..."
}
*/ 
  try {
    const classs = await Classs.findByIdAndUpdate( req.query.class_id, { endDate: Date.now() } );
    //TODO: count the total sessions/times this class was opened by getting the length of class attendence lists array
    //TODO: take one member at a time and determine the percentage of their attendences/appearances out of the total
    //TODO: if they attended atleast 75% of the total number of sessions held, then write this course to their 
    //      list of completed courses so that they increase their chances of earning a trainning certificate.
    res.status(200).send({ success: "You have ended the class ("+classs.classsName+")" });
  } catch (err) {
    res.status(500).send({message: err.message || 'The class ('+classs.classsName+') could not be ended.'});
    console.log(err);
  }
};

module.exports = { Classs };



