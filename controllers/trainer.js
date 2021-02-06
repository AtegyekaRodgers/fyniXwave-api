const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Trainer = require('../models/trainer');
const Course = require('../models/course');
const Skill = require('../models/skill');

const Affiliation = require('../controllers/affiliation');
const CourseTrainer = require('../controllers/course_trainer');
const TrainerSkill = require('../controllers/trainer_skill');

// Creating a new trainer profile
Trainer.create = async (req, res) => { 

/* req.body = 
{
    email: "...",
    phone: "...",
    country: "...",
    firstname: "...",
    lastname: "...",
    username: "...",
    password: "...",
    discipline: "...",
    specialization: "...",
    institution: "...",
    courses: ["...", "...", "..."],
    skills: ["...", "...", "..."]
} 

res.body = {
    message: '......'
}
*/
  try { 
    //first create a parent user entity for this trainer, or identify if already exists.
    //retrieve the possibly existing user
    let usr_id;
    const count = await User.findOne()
    .where('email').equals(req.body.email)
    .where('firstname').equals(req.body.firstname)
    .where('lastname').equals(req.body.lastname)
    .select("_id").count()
    .limit(1)
    .exec(function(err, datta){
        if(err){ console.log("trainer controller: Failed to check for existance of user"); return 0; }
        else if(datta){
          usr_id = datta._id;
        }
    });
    
    if(count > 0){ 
        // usr exists,
        // add 'trainer' to the set of usercategory of existing user
        let categories = ["trainer"];
        const updated = await User.findByIdAndUpdate(
          usr_id, { $addToSet: { usercategory: { $each: categories } } }, { useFindAndModify: false }
        );
    }
    
    if(count < 1){ 
    // usr does not exist, create a new one.
        // Hashing the password:
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
     
         let usr = {
            email: req.body.email,
            country: req.body.country,
            firstname: req.body.firstname, 
            lastname: req.body.lastname,
            username: req.body.username,
            password: req.body.password,
            usercategory: ["trainer"]
        };
        const newUser = new User( usr );
        await newUser.save();
        usr_id = newUser._id;
    }
      
    // saving the trainer profile
    let trnr = {
        trainerName: req.body.firstname + req.body.lastname,
        discipline: req.body.discipline, 
        specialization: req.body.specialization,
        userId: usr_id
    };
    const trainer = new Trainer( trnr );
    await trainer.save(); 
    
    if(req.body.institution){  
        //creation request has told me which institution this trainer belongs to, so create an affiliation.
        var ok = trainer.attachInstitution(req.body.institution);
    } 
    if(req.body.courses){
        //req.body.courses should be an array of strings (the courses this trainer handles)
        let coursesArray = req.body.courses;
        coursesArray.forEach((key, course)=>{
            //retrieve course id using course name, create it if it's not found.
            let course_id = "";
            const result = await Course.findOne()
            .where('courseName').equals(course) 
            .exec(function(err, datta){
                      if(err){
                        console.log("trainer controller: Failed to retrieve course id using course name");
                        return {error: err };
                      }else if(datta){
                        course_id = datta._id;
                        return datta;
                      }
                  }
            );
            var ok = trainer.attachCourse(course_id);
        });
    }
    if(req.body.skills){
        //req.body.skills should be an array of strings (the skills)
        let skillsArray = req.body.skills;
        skillsArray.forEach((key, skill)=>{
            //retrieve skill id using skill name, create it if it's not found. 
            let skill_id = "";
            const result = await Course.findOne()
            .where('courseName').equals(course) 
            .exec(function(err, datta){
                      if(err){
                        console.log("trainer controller: Failed to retrieve course id using course name"); 
                        return {error: err };
                      }else if(datta){
                        skill_id = datta._id;
                        return datta;
                      }
                  }
            );
            var ok = course.attachSkill(skill_id);
        });
    }
     
    res.status(201).json({ message: 'Trainer profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new trainer profile',
    });
  }
};

// Create trainer-institution affiliation.
Trainer.attachInstitution = async (institution_id) => {
    //grab this trainer's id
    let trainer_id = this._id;
    
    //create a new institution-trainer relationship  
    let relationship = {institution: institution_id, affiliate: trainer_id, affiliateType: "trainer"};
    
    let returned = Affiliation.create(relationship);
    if(returned.error){ 
        console.log(returned.error);
        return false;
    }
    if(returned.success){
        console.log(returned.success);
        return true;
    }
};

// attach courses .
Trainer.attachCourse = async (course_id) => {
    //grab this trainer's id
    let trainer_id = this._id;
    
    //create a new trainer-skill relationship  
    let relationship = {trainer: trainer_id, course: course_id};
    
    let returned = CourseTrainer.create(relationship);
    if(returned.error){ 
        console.log(returned.error);
        return false;
    }
    if(returned.success){
        console.log(returned.success);
        return true;
    }
};

// attach skills .
Trainer.attachSkill = async (skill_id) => {
    //grab this trainer's id
    let trainer_id = this._id;
    
    //create a new trainer-skill relationship  
    let relationship = {trainer: trainer_id, skill: skill_id};
    
    let returned = TrainerSkill.create(relationship);
    if(returned.error){ 
        console.log(returned.error);
        return false;
    }
    if(returned.success){
        console.log(returned.success);
        return true;
    }
};

// Adding or updating profile picture for an trainer
Trainer.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let trainer = await Trainer.findById(req.query.id);
    const updated = await Trainer.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || trainer.profilePicture },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all trainers
Trainer.readAll = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving trainers',
    });
  }
};

// Retrieve single trainer
Trainer.readOne = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.query.id);
    res.json(trainer);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this trainer',
    });
    console.log(err);
  }
};

module.exports = { Trainer };



