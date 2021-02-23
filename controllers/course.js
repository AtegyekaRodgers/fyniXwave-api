const mongoose = require('mongoose');

const Course = require('../models/course');
const InstitutionCourse = require('../controllers/institution_course');
const CourseTrainer = require('../controllers/course_trainer');
const CourseLearner = require('../controllers/course_learner'); 
const CourseSkill = require('../controllers/course_skill');

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
        courseCode: req.body.courseCode,
        discipline: req.body.discipline, 
        specialization: req.body.specialization,
    };
    const course = new Course( cours );
    await course.save(); 
    if(req.body.institution){  
        //creation request has told me which institution offers this course, so attach it.
        var ok = course.attachInstitution(req.body.institution);
    }
    if(req.body.trainers){  
        //req.body.trainers should be an array of strings (the skills)
        let trainersArray = req.body.trainers;
        trainersArray.forEach((key, trainer)=>{
             //trainer must be an id of an existing/registered trainer.
             var ok = course.attachTrainer(trainer);
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
               }
            );
            var ok = course.attachSkill(skill_id);
        });
    }
    
    res.status(201).json({ message: 'Course profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new course profile',
    });
  }
};

// Attach institution that offers this course.
Course.attachInstitution = async (institution_id) => {
    //grab this course's id
    let course_id = this._id;
    
    //create a new institution-course relationship  
    let relationship = { institution: institution_id, course: course_id };
    
    let returned = InstitutionCourse.create(relationship);
    if(returned.error){
        console.log(returned.error);
        return false;
    }
    if(returned.success){
        console.log(returned.success);
        return true;
    }
};

// attach a trainer to this course.
Course.attachTrainer = async (trainer_id) => {
    //grab this course's id
    let course_id = this._id;
    
    //create a new course-trainer relationship  
    let relationship = {course: course_id, trainer: trainer_id};
    
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

// attach skills acquired from this course.
Course.attachSkill = async (skill_id) => {
    //grab this course's id
    let course_id = this._id;
    
    //create a new course-trainer relationship  
    let relationship = {course: course_id, skill: skill_id};
    
    let returned = CourseSkill.create(relationship);
    if(returned.error){ 
        console.log(returned.error);
        return false;
    }
    if(returned.success){
        console.log(returned.success);
        return true;
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



