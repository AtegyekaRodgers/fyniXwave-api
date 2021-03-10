const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Course = require('../models/course');
const Learner = require('../models/learner');
const Skill = require('../models/skill');
const LearnerSkillModel = require('../models/learner_skill');
const JobSkill = require('../models/job_skill');
const Classs = require('../models/classs');
 
const {InstitutionLearner} = require('./institution_learner');
const {CourseLearner} = require('./course_learner');
const {LearnerSkill} = require('./learner_skill');
const {LearnerClasss} = require('./learner_classs');

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

// Creating a new lear profile
Learner.create = async (req, res) => {
/* req.body = 
{
    "email": "...",
    "phone": "...",
    "country": "...",
    "firstname": "...",
    "lastname": "...",
    "username": "...",
    "password": "...",
    "interests": ["...", "..."],
    "discipline": "...",
    "specialization": "...",
    "userId": "...", //key
    "institution": "...",
    "courses": ["...", "...", "..."],
    "skills": ["...", "...", "..."],
    "classes": ["...", "...", "..."]
} 

res.body = {
    "message": "......"
}
*/
  try {
    //first create a parent user entity for this learner, or identify if already exists.
    //retrieve the possibly existing user
    let usr_id;
    let count = 0;
    const result = User.findOne()
    .where('email').equals(req.body.email)
    .where('firstname').equals(req.body.firstname)
    .where('lastname').equals(req.body.lastname)
    .select("_id")
    .exec(function(err, datta){
        if(err){ console.log("learner controller: Failed to check for existance of user"); return 0; }
        else if(datta){
         usr_id = datta._id;
         if(usr_id){count = 1;}
         console.log("count = ", count);
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
            Learner.attachInstitution({id:newLearnerId, institution_id:req.body.institution}, feedbackCB);
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
                    Learner.attachCourse({id:newLearnerId, course_id}, feedbackCB);
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
                    Learner.attachSkill({id:newLearnerId, skill_id}, feedbackCB);
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
                    Learner.attachClasss({id:newLearnerId, classs_id}, feedbackCB);
                }
            });
        }
        res.status(201).json({ message: 'Learner profile successfully created', _id:newLearnerId });
    });  
  }catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new learner profile',
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
      message: err.message || 'An error occured while retrieving Learners',
    });
  }
};

// Retrieve single learner
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

Learner.marketCourses = async (req, res) => {
  try {
    const targetLearner = await Learner.find({userId:req.body.userId}, (err, learnr)=>{
        if(err){ throw {message: "Target learner not found"}; }
        const relevantCourses = Course.find({discipline:learnr.discipline}, (er, crses)=>{
            if(er){ throw {message: "Relevant course not found"}; } 
            //find interests of this user in User collection
            const thisUser = User.find({_id:req.body.userId}, (er1, usrr)=>{
                const relevantCourses =  Course.find({$or: [{discipline:learnr.discipline}, {tags: {$in: usrr.interests}}] }, 
                (er2, crses2)=>{
                   let allRelevantCourses = [];
                   if(!er2){
                       allRelevantCourses = crses.concat(crses2);
                   }
                   //then send all together
                   res.status(200).send(allRelevantCourses); 
                });
            });
        });
    });
  }catch (err) {
    console.log(err);
    res.status(500).send({message: err.message || "Unfortunitely we could not retreive suitable courses for you. Let's keep trying..."});
  }
};

Learner.marketJobs = async (req, res) => {
  /* req.body = 
    {
       "userId": "..."
    }
  */
  try {
    const targetLearner = await Learner.findOne({userId:req.body.userId}, (err, learnr)=>{
        if(err){ throw {message: "Target learner not found"}; }
        //if the learner was found,
        if(learnr._id){
        //first consider skills possessed by this learner for relevant jobs
        const result = LearnerSkillModel.find({learner:learnr._id}, (err1, relationships)=>{
            if(err1){ throw {message: err1.message || "Some error occured while identifying the learner"}; }
            //if atleast one relationship was found,
            if (relationships && (relationships.length>0)){
            //now get all returned records/documents into an array of their 'relationship.skill' attribute
            let learnerSkillsArr = relationships.map((rlship)=>{ return rlship.skill; }); 
            //now query the job skills that match any of the skills in the  'learnerSkillsArr'
            const resultx = JobSkill.find({skill: {$in: learnerSkillsArr}}, (err1_2, jobSkillRelationships)=>{
                let jobsKeysArr = jobSkillRelationships.map((jsrlship)=>{ return jsrlship.job; });
                //if atleast one jobSkillRelationship was found,
                if (jobSkillRelationships && (jobSkillRelationships.length>0)){
                //now query all jobs with _id included in the 'jobsKeysArr'
                const relevantJobs1 = Job.find({_id:{$in: jobsKeysArr }},(errr, jbs1)=>{
                   if(errr){ throw {message: "Fail while retreiving suitable jobs for you. We will keep trying."}; } 
                   // consider discipline for relevant jobs 
                    const relevantJobs = Job.find({discipline:learnr.discipline}, (er, jbs2)=>{
                        if(er){ throw {message: "Relevant job not found"}; } 
                        //find interests of this user in User collection
                        const thisUser = User.find({_id:req.body.userId}, (er1, usrr)=>{
                            //consider interests to find more relevant jobs for the learner
                            const relevantJobs = Job.find({$or: [{discipline:learnr.discipline}, {tags: {$in: usrr.interests}}] }, 
                            (er2, jbs3)=>{
                               let allRelevantJobs = [...jbs1, ...jbs2, ...jbs3];
                               //remove duplicates from the array 'allRelevantJobs'
                               let uniqueRelevantJobs = [...new Set(allRelevantJobs)];
                               //then send all jobs found
                               res.status(200).send(uniqueRelevantJobs);
                            });
                        });
                    }); 
                });
               } //end if job-skill relationships found
            });
           } //end if relationships found
        });
       } //end if learner found
    });
  }catch (err) {
    res.status(500).send({message: err.message || 'Unfortunitely the system can not retreive suitable jobs for you'});
    console.log(err);
  }
};

module.exports = { Learner };



