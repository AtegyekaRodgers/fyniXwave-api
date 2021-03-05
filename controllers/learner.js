const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Course = require('../models/course');
const Learner = require('../models/learner');
const Skill = require('../models/skill');
 
const InstitutionLearner = require('./institution_learner');
const CourseLearner = require('./course_learner');
const LearnerSkill = require('./learner_skill');
const LearnerClasss = require('./learner_classs');

// Create institution-learner relationship.
Learner.attachInstitution = async (params, cback) => {
    try {
        //grab this learner's id
        let learner_id = params.id;
        
        //create a new institution-learner relationship  
        let relationship = {institution: params.institution_id, learner:learner_id};
        
        let feedBackCB = (returned) => {
            if(returned.error){
                console.log("Learner.attachInstitution: InstitutionLearner.create(relationship) returned error =", returned.error);
                cback(false);
            }
            if(returned.success){
                console.log("Learner.attachInstitution: InstitutionLearner.create(relationship) returned success=", returned.success);
                cback(true);
            }
        }
        InstitutionLearner.create(relationship, feedBackCB);
    }catch (err) {
        console.log("Learner.attachInstitution: !! Error =", err);
        cback(false);
    }
};

// attach courses .
Learner.attachCourse = async (params, cback) => {
    try {
        //grab this learner's id
        let learner_id = params.id;
        
        //create a new learner-course relationship
        let relationship = {learner: learner_id, course: params.course_id};
        
        let feedBackCB = (returned) => {
            if(returned.error){
                console.log("Learner.attachCourse: CourseLearner.create(relationship) returned error =", returned.error);
                cback(false);
            }
            if(returned.success){
                console.log("Learner.attachCourse: CourseLearner.create(relationship) returned success=", returned.success);
                cback(true);
            }
        }
        CourseLearner.create(relationship, feedBackCB);
    }catch (err) {
        console.log("Learner.attachCourse: !! Error =", err);
        cback(false);
    }
};

// Create learner-classs relationship.
Learner.attachClasss = async (params, cback) => {
    try {
        //grab this learner's id
        let learner_id = params.id;
        
        //create a new learner-classs relationship
        let relationship = {classs: params.classs_id, learner:learner_id};
        
        let feedBackCB = (returned) => {
            if(returned.error){
                console.log("Learner.attachClasss: LearnerClasss.create(relationship) returned error =", returned.error);
                cback(false);
            }
            if(returned.success){
                console.log("Learner.attachClasss: LearnerClasss.create(relationship) returned success=", returned.success);
                cback(true);
            }
        }
        LearnerClasss.create(relationship, feedBackCB);
    }catch (err) {
        console.log("Learner.attachClasss: !! Error =", err);
        cback(false);
    }
};

// attach skills .
Learner.attachSkill = async (params, cback) => {
    try {
        //grab this learner's id
        let learner_id = params.id;
        
        //create a new learner-skill relationship
        let relationship = {learner: learner_id, skill: params.skill_id};
        
        let feedBackCB = (returned) => {
            if(returned.error){
                console.log("Learner.attachSkill: LearnerSkill.create(relationship) returned error =", returned.error);
                cback(false);
            }
            if(returned.success){
                console.log("Learner.attachSkill: LearnerSkill.create(relationship) returned success=", returned.success);
                cback(true);
            }
        }
        LearnerSkill.create(relationship, feedBackCB);
    }catch (err) {
        console.log("Learner.attachSkill: !! Error =", err);
        cback(false);
    }
};

// Creating a new trainer profile
Learner.create = async (req, res) => {
/* req.body = 
{
    email: "...",
    phone: "...",
    country: "...",
    firstname: "...",
    lastname: "...",
    username: "...",
    password: "...",
    interests: ["...", "..."],
    discipline: "...",
    specialization: "...",
    institution: "...",
    courses: ["...", "...", "..."],
    skills: ["...", "...", "..."],
    classes: ["...", "...", "..."]
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
            let categories = ["learner"];
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
                usercategory: ["learner"]
            };
            const newUser = new User( usr );
            newUser.save((err, usrr)=>{
                if(err){ console.log("newUser.save: !!Error = ",err); }
                usr_id = usrr._id; 
            }); 
         }
          
        }
    });
      
    // saving the learner profile
    let lrnr = {
        learnerName: req.body.firstname + req.body.lastname,
        discipline: req.body.discipline, 
        specialization: req.body.specialization,
        userId: usr_id
    };
    const learner = new Learner( lrnr );
    await learner.save((err, lrnr) => {
        let feedbackCB = (fdback) => { return fdback; };
        var newLearnerId = lrnr._id;
        if(req.body.institution){  
            //creation request has told me which institution this learner belongs to.
            Trainer.attachInstitution({id:newLearnerId, institution_id:req.body.institution}, feedbackCB);
        }
        if(req.body.courses){
            //req.body.courses should be an array of strings 
            let coursesArray = req.body.courses;
            coursesArray.forEach((key, course)=>{
                //retrieve course id using course name, create it if it's not found.
                let course_id = "";
                const result = Course.findOne()
                .where('courseName').equals(course) 
                .exec(function(err, datta){
                          if(err){
                            console.log("leearner controller: Failed to retrieve course id using course name");
                            return {error: err };
                          }else if(datta){
                            course_id = datta._id;
                            return datta;
                          }
                      }
                );
                if(course_id!=""){
                    Trainer.attachCourse({id:newLearnerId, course_id}, feedbackCB);
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
                            console.log("learner controller: Failed to retrieve course id using course name"); 
                            return {error: err };
                          }else if(datta){
                            skill_id = datta._id;
                            console.log("learner, Skill.findOne: skill_id =", skill_id);
                          }
                      }
                );
                if(skill_id!=""){
                    Trainer.attachSkill({id:newLearnerId, skill_id}, feedbackCB);
                }
            });
        }
        if(req.body.classes){
            //req.body.classes should be an array of strings (the classes)
            let classesArray = req.body.classes;
            classesArray.forEach((key, classs)=>{
                //retrieve skill id using skill name, create it if it's not found. 
                let classs_id = "";
                const result = Classs.findOne()
                .where('classsName').equals(classs) 
                .exec(function(err, datta){
                          if(err){
                            console.log("learner controller: Failed to retrieve course id using course name"); 
                            return {error: err };
                          }else if(datta){
                            classs_id = datta._id;
                            console.log("learner, Classs.findOne: classs_id =", classs_id);
                          }
                      }
                );
                if(classs_id!=""){
                    Trainer.attachClasss({id:newLearnerId, classs_id}, feedbackCB);
                }
            });
        }
        
    }); 
     
    res.status(201).json({ message: 'Learner profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new trainer profile',
    });
  }
};

// Adding or updating profile picture for a learner
Learner.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let learner = await Learner.findById(req.query.id);
    const updated = await Learner.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || learner.profilePicture, cloudinaryId: result.public_id },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all learners
Learner.readAll = async (req, res) => {
  try {
    const learners = await Learner.find();
    res.status(200).json(learners);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving trainers',
    });
  }
};

// Retrieve single trainer
Learner.readOne = async (req, res) => {
  try {
    const learner = await Learner.findById(req.query.id);
    res.json(learner);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this learner',
    });
    console.log(err);
  }
};

module.exports = { Learner };



