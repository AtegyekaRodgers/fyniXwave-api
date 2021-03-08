const mongoose = require('mongoose');

const Job = require('../models/job');

// Creating a new job profile
Job.create = async (req, res) => {
    /* req.body = 
    {
        jobName: { type: Schema.Types.ObjectId, ref: "Institution" },
        discipline: { type: String },
        jobLink: { type: String },
        jobSummary: { type: String },
        profilePicture: { type: String },
        cloudinaryId: { type: String },
        datePosted: { type: Date },
        deadline: { type: Date },
        tags: [String]
    }
    */ 
  
  try {
    // saving the profile
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ message: 'Job profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new job profile',
    });
  }
};

// Adding or updating profile picture for a job
Job.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let job = await Job.findById(req.query.id);
    const updated = await Job.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || job.profilePicture, cloudinaryId: result.public_id },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all jobs
Job.readAll = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving jobs',
    });
  }
};

// Retrieve single job
Job.readOne = async (req, res) => {
  try {
    const job = await Job.findById(req.query.id);
    res.json(job);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this job',
    });
    console.log(err);
  }
};

module.exports = { Job };



