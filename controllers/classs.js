const mongoose = require('mongoose');

const Classs = require('../models/classs');

// Creating a new classs record
Classs.create = async (req, res) => {
/* req.body = 
{
   classsName: "...",
   parentCourse: "..." //key
   parentInstitution: "..." //key, required
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

module.exports = { Classs };



