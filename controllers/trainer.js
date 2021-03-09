const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Trainer = require('../models/trainer');
const Course = require('../models/course');
const Skill = require('../models/skill');

const {Affiliation} = require('./affiliation');
const {CourseTrainer} = require('./course_trainer');
const {TrainerSkill} = require('./trainer_skill');

// Create trainer-institution affiliation.
Trainer.attachInstitution = async (params, cback) => {
    try {
        //grab this trainer's id
        let trainer_id = params.id;
        
        //create a new institution-trainer relationship  
        let relationship = {institution: params.institution_id, affiliate: trainer_id, affiliateType: "trainer"};
        
        let feedBackCB = (returned) => {
            if(returned.error){
                console.log("Trainer.attachInstitution: Affiliation.create(relationship) returned error =", returned.error);
                cback(false);
            }
            if(returned.success){
                console.log("Trainer.attachInstitution: Affiliation.create(relationship) returned success=", returned.success);
                cback(true);
            }
        }
        Affiliation.create(relationship, feedBackCB);
    }catch(err){
        console.log("Trainer.attachInstitution: !! Error =", err);
        cback(false);
    }
};

// attach courses .
Trainer.attachCourse = async (params, cback) => {
    try {
        //grab this trainer's id
        let trainer_id = params.id;
        
        //create a new trainer-skill relationship  
        let relationship = {trainer: trainer_id, course: params.course_id};
        
        let feedBackCB = (returned) => {
            if(returned.error){ 
                console.log("Trainer.attachCourse: CourseTrainer.create(relationship) returned error=", returned.error);
                cback(false);
            }
            if(returned.success){
                console.log("Trainer.attachCourse: CourseTrainer.create(relationship) returned success=", returned.success);
                cback(true);
            }
        }
        CourseTrainer.create(relationship, feedBackCB);
    }catch (err) {
        console.log("Trainer.attachCourse: !! Error =", err);
        cback(false);
    }
};

// attach skills .
Trainer.attachSkill = async (params, cback) => {
    try {
        //grab this trainer's id
        let trainer_id = params.id;
        
        //create a new trainer-skill relationship  
        let relationship = {trainer: trainer_id, skill: params.skill_id};
        
        let feedBackCB = (returned) => {
            if(returned.error){
                console.log("Trainer.attachSkill: TrainerSkill.create(relationship) returned error=", returned.error);
                cback(false);
            }
            if(returned.success){
                console.log("Trainer.attachSkill: TrainerSkill.create(relationship) returned success=", returned.success);
                cback(true);
            }
        }
        TrainerSkill.create(relationship, feedBackCB);
    }catch (err) {
        console.log("Trainer.attachSkill: !! Error =", err);
        cback(false);
    }
};


// Creating a new trainer profile
Trainer.create = async (req, res) => { 
/*eg, req.body = 
{
    "email": "atrodgers77@gmail.com",
    "phone": "...",
    "country": "Uganda",
    "firstname": "Ategyeka",
    "lastname": "Rodgers",
    "username": "rodgers",
    "userId": "603f47b30659d72147b9506a",
    "password": "rodgers",
    "discipline": null,
    "specialization": "Software engineering",
    "institution": "603f8a84efc9d14364393f0a",
    "courses": ["Programming", "Software architecture", "HTML5"],
    "skills": ["Web development", "Database modelling", "Systems engineering"]
} 

res.body = {
    message: '......'
}
*/
  try { 
    //first create a parent user entity for this trainer, or identify if already exists.
    //retrieve the possibly existing user
    let usr_id;
    let count = 0;
    const result = User.findOne()
    .where('email').equals(req.body.email)
    .where('firstname').equals(req.body.firstname)
    .where('lastname').equals(req.body.lastname)
    .select("_id")
    .exec(function(err, datta){
        if(err){ console.log("trainer controller: Failed to check for existance of user"); return 0; }
        else if(datta){
         usr_id = datta._id;
         if(usr_id){count = 1;}
         console.log("count = ", count);
         if(count > 0){
            // usr exists,
            // add 'trainer' to the set of usercategory of existing user
            let categories = ["trainer"];
            const updated = User.findByIdAndUpdate(
              usr_id, { $addToSet: { usercategory: { $each: categories } } }, { useFindAndModify: false }
            );
         }
        
         if(count < 1){ 
         // usr does not exist, create a new one.
            // Hashing the password:
            const salt = bcrypt.genSalt(10);
            const hashedPassword = bcrypt.hash(req.body.password, salt);
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
            newUser.save((err, usrr)=>{
                if(err){ console.log("newUser.save: !!Error = ",err); }
                usr_id = usrr._id; 
            }); 
         }
          
        }
    });
     
    // saving the trainer profile
    let trnr = {
        trainerName: req.body.firstname + req.body.lastname,
        discipline: req.body.discipline, 
        specialization: req.body.specialization,
        userId: usr_id
    };
    const trainer = new Trainer( trnr );
    await trainer.save((err, trnr) => {
        let feedbackCB = (fdback) => { return fdback; };
        var newTrainerId = trnr._id;
        if(req.body.institution){  
            //creation request has told me which institution this trainer belongs to, so create an affiliation.
            Trainer.attachInstitution({id:newTrainerId, institution_id:req.body.institution}, feedbackCB);
        }
        if(req.body.courses){
            //req.body.courses should be an array of strings (the courses this trainer handles)
            let coursesArray = req.body.courses;
            coursesArray.forEach((key, course)=>{
                //retrieve course id using course name, create it if it's not found.
                let course_id = "";
                const result = Course.findOne()
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
                if(course_id!=""){
                    Trainer.attachCourse({id:newTrainerId, course_id}, feedbackCB);
                }
            });
        }
        if(req.body.skills){
            //req.body.skills should be an array of strings (the skills)
            let skillsArray = req.body.skills;
            skillsArray.forEach((key, skill)=>{
                //retrieve skill id using skill name, create it if it's not found. 
                let skill_id = "";
                const result = Skill.findOne()
                .where('skillName').equals(skill) 
                .exec(function(err, datta){
                          if(err){
                            console.log("trainer controller: Failed to retrieve course id using course name"); 
                            return {error: err };
                          }else if(datta){
                            skill_id = datta._id;
                            console.log("trainer, Skill.findOne: skill_id =", skill_id);
                          }
                      }
                );
                if(skill_id!=""){
                    Trainer.attachSkill({id:newTrainerId, skill_id}, feedbackCB);
                }
            });
        }
        
    });  
    res.status(201).json({ message: 'Trainer profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new trainer profile',
    });
  }
};

// Adding or updating profile picture for a trainer
Trainer.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let trainer = await Trainer.findById(req.query.id);
    const updated = await Trainer.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || trainer.profilePicture, cloudinaryId: result.public_id },
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



