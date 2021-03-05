const mongoose = require('mongoose');

const Classs = require('../models/classs');
const Course = require('../models/course');
const LearnerClasss = require('../models/learner_classs');
const CourseLearner = require('../models/course_learner');
const Learner = require('../models/learner');

// Creating a new classs record
Classs.create = async (req, res) => {
/*  let days = 20;
    let endDate = new Date(Date.now() + (days * 24*60*60*1000));

    req.body = 
    {
       "classsName": "Class of 2021",
       "parentCourse": "...",
       "parentInstitution": "603f8a84efc9d14364393f0a",
       "startDate": Date.now(),
       "endDate": endDate
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

// Adding or updating profile picture for a classs
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
    //retreive the current number of entries in attendences specifically for this class
    let existingListsCount;
    const classToOpen = Classs.findById(req.body.class_id).select("attendences")
    .exec(function (err, arrayOfAttendenceLists) {
        if (err) return next(err);
        existingListsCount = arrayOfAttendenceLists.length;
    });
    const updatedClass = await Classs.findByIdAndUpdate( req.body.class_id, {$addToSet: {attendences: attendenceList}} );
    
    //Index of the newly added/created attendence list is needed for attendees to reference when signing for class attendence.
    let newAttendenceListIndex = existingListsCount;
    //send it to client
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
    /*req.body = 
    {
        class_id: "...",
        parent_course_id: "...",
        user_id: "...",
        learner_id: "...",
        list_index: "..."
    }
    */
    try {
        let parentCourseAccessibility = Course.findById(req.body.parent_course_id)
                                              .select("accessibility")
                                              .exec((err, data)=>{return data;}); 
        //is this a paid course ?
        if(parentCourseAccessibility == "paid"){
            //enforce payment 
            const coursePayment = await CourseLearner.find({learner:req.body.learner_id, course:req.body.parent_course_id})
                                                     .exec((err, coursepmt)=>{ return coursepmt; });
            //if user/learner paid, allow continuing
            if(coursePayment.amountPaid <= 0){  
                //the learner has not paid for this course.
                //send an error message and return
                res.send({error: 'This course is not free, please pay for it first.'});
            }
        }
    
        //describe the exact session that you want to attend 
        let user_id = req.body.user_id;
        let attendenceListIndex = req.body.list_index;
        // retrieve the attendences
        const allAttendences = Classs.findById(req.body.class_id).select("attendences")
        .exec(function (err, arrayOfAttendenceLists) {
            if (err) return next(err);
            return arrayOfAttendenceLists;
        });
        //push the user_id to the appropriate list, hence, the user signs onto the attendencelist
        allAttendences[req.body.list_index].members.push(req.body.user_id); 
        //write the list back to the array of attendence lists, replacing the old one
        const updatedAttendenceLists = Classs.findByIdAndUpdate(req.body.class_id, {attendences:allAttendences});
        //Alternatively:
        //const allAttendences = Classs.findByIdAndUpdate(req.body.class_id, {attendences:[...attendences, attendences[req.body.list_index]:{...attendences[req.body.list_index], members:[...members, req.body.user_id]}]});                       
        
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
    const attendeceListsArr = await Classs.findById( req.query.class_id).select("attendences").exec((err, listsArr)=>{
        return listsArr;
    });
    //count the total sessions/times this class was opened by getting the length of class attendence lists array
    let listcount = attendeceListsArr.length;
    
    //take one member at a time and determine the percentage of their attendences/appearances out of the total
    const membersArr = await LearnerClasss.find({classs:req.query.class_id}).exec((err, mbersArr)=>{
        if(err){ console.log(err); return []; }
        return mbersArr;
    }); 
    membersArr.forEach((member)=>{
        let memberAttendencesCount = 0;
        attendeceListsArr.forEach((list)=>{
            if(list.includes(member.learner)){
                //the member attended this skilling-session and signed on the attendence list.
                memberAttendencesCount++;
            }
        });
        let percentageAttendence = (listcount > 0) ? (memberAttendencesCount/listcount)*100 : 0;
        
        //if member attended atleast 70% of the total number of sessions held,
        if(percentageAttendence >= 70){
            //write this course to the member's list of completed courses so that 
            //they increase their chances of earning a training certificate.
            const updatedLearner = Learner.findByIdAndUpdate( member.learner, {$addToSet: {completed: req.body.parent_course_id}} );
        }
    });
    
    res.status(200).send({ success: "You have ended the class ("+classs.classsName+")" });
  } catch (err) {
    res.status(500).send({message: err.message || 'The class ('+classs.classsName+') could not be ended.'});
    console.log(err);
  }
};

module.exports = { Classs };



