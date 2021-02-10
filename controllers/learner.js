const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Discipline = require('../models/discipline');
const Course = require('../models/course');
const Learner = require('../models/learner');
const Skill = require('../models/skill');
 
const CourseLearner = require('../controllers/course_learner');
const LearnerSkill = require('../controllers/learner_skill');
const LearnerClasss = require('../controllers/learner_classs');

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
    const count = User.findOne()
    .where('email').equals(req.body.email)
    .where('firstname').equals(req.body.firstname)
    .where('lastname').equals(req.body.lastname)
    .select("_id").count()
    .limit(1)
    .exec(function(err, datta){
        if(err){ console.log("learner controller: Failed to check for existance of user"); return 0; }
        else if(datta){
          usr_id = datta._id;
        }
    });
    
    if(count > 0){ 
        // usr exists,
        // add 'learner' to the set of usercategory of existing user
        let categories = ["learner"];
        const updated = User.findByIdAndUpdate(
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
            usercategory: ["learner"]
        };
        const newUser = new User( usr );
        await newUser.save();
        usr_id = newUser._id;
    }
      
    // saving the learner profile
    let lrnr = {
        learnerName: req.body.firstname + req.body.lastname,
        discipline: req.body.discipline, 
        specialization: req.body.specialization,
        userId: usr_id
    };
    const learner = new Learner( lrnr );
    await learner.save(); 
    
    if(req.body.institution){
        //creation request has told me which institution this learner belongs to, so create a learner-skill relationship.
        var ok = learner.attachInstitution(req.body.institution);
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
                        console.log("learner controller: Failed to retrieve course id using course name");
                        return {error: err };
                      }else if(datta){
                        course_id = datta._id;
                        return datta;
                      }
                  }
            );
            var ok = learner.attachCourse(course_id);
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
                        console.log("learner controller: Failed to retrieve skill id using skill name"); 
                        return {error: err };
                      }else if(datta){
                        skill_id = datta._id;
                        return datta;
                      }
                  }
            );
            var ok = learner.attachSkill(skill_id);
        });
    }
    if(req.body.classes){
        //req.body.classes should be an array of strings (the classes)
        let classesArray = req.body.classes;
        classesArray.forEach((key, classs)=>{
            //retrieve classs id using classs name. 
            let classs_id = "";
            const result = Classs.findOne()
            .where('classsName').equals(classs) 
            .exec(function(err, datta){
                      if(err){
                        console.log("learner controller: Failed to retrieve classs id using classs name"); 
                        return {error: err };
                      }else if(datta){
                        classs_id = datta._id;
                        return datta;
                      }
                  }
            );
            var ok = learner.attachClasss(classs_id);
        });
    }
     
    res.status(201).json({ message: 'Learner profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new trainer profile',
    });
  }
};

// Create learner-institution relationship.
Learner.attachInstitution = async (institution_id) => {
    //grab this trainer's id
    let learner_id = this._id;
    
    //create a new institution-learner relationship  
    let relationship = {institution: institution_id, learner:learner_id};
    
    let returned = LearnerSkill.create(relationship);
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
Learner.attachCourse = async (course_id) => {
    //grab this trainer's id
    let learner_id = this._id;
    
    //create a new learner-skill relationship  
    let relationship = {learner: learner_id, course: course_id};
    
    let returned = CourseLearner.create(relationship);
    if(returned.error){ 
        console.log(returned.error);
        return false;
    }
    if(returned.success){
        console.log(returned.success);
        return true;
    }
};

// Create learner-classs relationship.
Learner.attachClasss = async (classs_id) => {
    //grab this learner's id
    let learner_id = this._id;
    
    //create a new institution-learner relationship  
    let relationship = {classs: classs_id, learner:learner_id};
    
    let returned = LearnerClasss.create(relationship);
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
Learner.attachSkill = async (skill_id) => {
    //grab this trainer's id
    let learner_id = this._id;
    
    //create a new trainer-skill relationship  
    let relationship = {learner: learner_id, skill: skill_id};
    
    let returned = LearnerSkill.create(relationship);
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
Learner.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let learner = await Learner.findById(req.query.id);
    const updated = await Learner.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || learner.profilePicture },
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



