const mongoose = require('mongoose');

const Course = require('../models/course');
const {InstitutionCourse} = require('./institution_course.js');
const {CourseTrainer} = require('./course_trainer');
const {CourseLearner} = require('./course_learner'); 
const {CourseSkill} = require('./course_skill');

// Attach institution that offers this course.
Course.attachInstitution = async (params, cback) => {
    try {
        //grab this course's id
        let course_id = params.id;
        
        //create a new institution-course relationship  
        let relationship = { institution: params.institution_id, course: course_id, courseCode:params.courseCode };
         
        let feedBackCB = (returned) => {
            if(returned && returned.error){
                console.log("Course.attachInstitution: InstitutionCourse.create(relationship) returned error=",returned.error);
                cback(false);
            }
            if(returned && returned.success){
                console.log("Course.attachInstitution: InstitutionCourse.create(relationship) returned success=", returned.success);
                cback(true);
            }
        }
        InstitutionCourse.create(relationship, feedBackCB);
    }catch (err) {
        console.log("Course.attachInstitution: !! Error =", err);
        cback(false);
    }
};

// attach a trainer to this course.
Course.attachTrainer = async (params, cback) => {
    try {
        //grab this course's id
        let course_id = params.id;
        
        //create a new course-trainer relationship  
        let relationship = {course: params.course_id, trainer: params.trainer_id};
         
        let feedBackCB = (returned) => {
            if(returned.error){ 
                console.log("Course.attachTrainer: CourseTrainer.create(relationship) returned error=",returned.error);
                cback(false);
            }
            if(returned.success){
                console.log("Course.attachTrainer: CourseTrainer.create(relationship) returned success=",returned.success);
                cback(true);
            }
        }
        CourseTrainer.create(relationship, feedBackCB);
    }catch (err) {
        console.log("Course.attachTrainer: !! Error =", err);
        cback(false);
    }
};

// attach skills acquired from this course.
Course.attachSkill = async (params, cback) => {
    try {
        //grab this course's id
        let course_id = params.id;
        
        //create a new course-trainer relationship  
        let relationship = {course: params.course_id, skill: params.skill_id};
         
        let feedBackCB = (returned) => {
            if(returned.error){ 
                console.log("Course.attachSkill: CourseSkill.create(relationship) returned error=",returned.error);
                cback(false);
            }
            if(returned.success){
                console.log("Course.attachSkill: CourseSkill.create(relationship) returned success=", returned.success);
                cback(true);
            }
        }
        CourseSkill.create(relationship, feedBackCB);
    }catch (err) {
        console.log("Course.attachSkill: !! Error =", err);
        cback(false);
    }
};


// Creating a new course profile
Course.create = async (req, res) => {
/* req.body = 
{
    courseName: "...",
    courseCode: "...",
    discipline: "...",
    specialization: "...",
    institution: "...",
    trainers: ["...", "...", "..."],
    skills: ["...", "...", "..."]
}
*/

  try {
    // saving the profile
    let cours = {
        courseName: req.body.courseName,
        discipline: req.body.discipline,
        specialization: req.body.specialization,
    };
    const course = new Course( cours );
    await course.save((err,crs) => {
        let feedbackCB = (fdback) => { return fdback; };
        var newCourseId = crs._id;
        if(req.body.institution){  
            //creation request has told me which institution offers this course, so attach it.
            Course.attachInstitution({id:newCourseId, institution_id:req.body.institution, courseCode:req.body.courseCode }, feedbackCB);    
        }
        if(req.body.trainers){  
            //req.body.trainers should be an array of strings (the skills)
            let trainersArray = req.body.trainers;
            trainersArray.forEach((key, trainer)=>{
                 //trainer must be an id of an existing/registered trainer.
                 Course.attachTrainer({id:newCourseId, trainer_id:trainer}, feedbackCB);
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
                        console.log("course controller: Failed to retrieve skill id using skill name"); 
                        return {error: err };
                      }else if(datta){
                        skill_id = datta._id;
                        return datta;
                      }
                });
                if(skill_id!=""){
                    Course.attachSkill({id:newCourseId, skill_id}, feedbackCB);
                }
            });
        }
    });
     
    res.status(201).json({ message: 'Course profile successfully created' });
    
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new course profile',
    });
  }
};

// Adding or updating profile picture for an course
Course.updateProfilePicture = async (req, res) => {
   try {
    // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let course = await Course.findById(req.query.id);
    const updated = await Course.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || course.profilePicture, cloudinaryId: result.public_id },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
       message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all courses
Course.readAll = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving courses',
    });
  }
};

// Retrieve single course
Course.readOne = async (req, res) => {
  try {
    const course = await Course.findById(req.query.id);
    res.json(course);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this course',
    });
    console.log(err);
  }
};

// Enroll a learner to this course
Course.enrolLearner = async (req, res) => {
  /* req.body = 
    { 
        learner_id: "...",
        course_id: "..."
    } 
  */ 
  try {
    let course_id = req.body.course_id;
    let learner_id = req.body.learner_id;
    
    let relationship = {course: course_id, learner: learner_id};
    
    let returned = CourseLearner.create(relationship);
    if(returned.error){
        console.log(returned.error);
        res.status(200).send({ error: "Sory, enrollment operation failed." });
    }
    if(returned.success){
        console.log(returned.success);
        res.status(200).send({ success: "Successfully enrolled for this course" });
    }
  }catch (err) {
    res.status(500).json({
       message: err.message || 'An error occured while trying to enroll learner to this course',
    });
  }
};

module.exports = { Course };



