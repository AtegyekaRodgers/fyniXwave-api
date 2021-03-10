const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');

require('../models/user');
require('../models/requests_to_join');
require('../models/institution_staff');
require('../models/activity');
require('../models/learner');
require('../models/alumnigroup');
require('../models/discussiongroup');

const User = mongoose.model('User');
const Learner = mongoose.model('Learner');
const AlumniGroup = mongoose.model('AlumniGroup');
const DiscussionGroup = mongoose.model('DiscussionGroup');
const JoinRequest = mongoose.model('JoinRequest');
const InstitutionStaff = mongoose.model('InstitutionStaff');
const Activity = mongoose.model('Activity');
const {InstitutionLearner} = require('./institution_learner');
const {LearnerClasss} = require('./learner_classs');

User.create = async (req, res) => {
  try {
    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    
    req.body.usercategory = [req.body.usercategory];
    // Saving user 
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'user successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new user',
    });
  }
};

User.readAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving users',
    });
  }
};

User.addInterests = async (req, res) => {
  try {
    const interests = req.body.interests.split(',').map(String);
    const updated = await User.findByIdAndUpdate(
      req.query.id,
      {
        $addToSet: {
          interests: {
            $each: interests,
          },
        },
      },
      { useFindAndModify: false },
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while adding interests',
    });
  }
};

User.requestToJoin = async (req, res) => {
  /*eg, req.body = 
    {
    "userId": "603f47b30659d72147b9506a",
    "fullName": "Rodgers Ategyeka",
    "whatToJoin": "discoussiongroup",
    "idOfWhatToJoin": "612f44b30659d72147b9503b",
    "nameOfWhatToJoin": "Discussion group two",
    "toJoinAs": "member",
    "staffId": "STF00487", //if applicable: optional and applies if 'toJoinAs' = 'staff'
    "title": "Superviser", //if applicable: optional and applies if 'toJoinAs' = 'staff',
    "discipline": "IT", //optional
    "canBeAcceptedBy": ["603f47b30659d72147b95062","413e47b30659d72147b95033"}]
    }
  */
  try {
    //ensure the request include all the required valid parameters
    if(!ObjectId.isValid(req.body.userId)){
        throw 'Err: userId parameter is not a valid mongoose ObjectId';
    }
    if(!ObjectId.isValid(req.body.idOfWhatToJoin)){
        throw 'Err: idOfWhatToJoin parameter is not a valid mongoose ObjectId';
    }
    if((req.body.toJoinAs=="student" || req.body.toJoinAs=="learner") && ((!req.body.discipline) || (req.body.discipline==""))){  
        throw 'Err: please specify your discipline (area of study) in order to be accepted as a student.';
    }
    // saving the request
    const joinRequest = new JoinRequest(req.body);
    await joinRequest.save();
    res.status(201).json({ message: 'You have successfully joined' });
  }catch (err) {
    res.status(500).json({message: err.message || 'An error occured while submitting your request to join'});
  }
};

// Retrieve all user activity logs
User.viewUserActivity = async (req, res) => {
  try {
    const activities = await Activity.find({user: req.params.userId});
    res.status(200).json(activities);
  }catch (err){
    res.status(500).json({
      message: err.message || 'An error occured while retreiving activity logs'
    });
  }
};

// Retrieve all user activity logs
User.viewRequestsToJoin = async (req, res) => {
  try {
    const joinRequests = await JoinRequest.find({canBeAcceptedBy: req.params.userId});
    res.status(200).json(joinRequests);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retreiving join requests',
    });
  }
};

User.acceptRequestsToJoin = async (req, res) => {
  /* req.body = 
    {
      accepted_request_id: "..." //must be a valid mongoose ObjectId
    }
  */
  try {
    let responseMessage = "";
    //read the request by the accepted_request_id
    let targetRequest = await JoinRequest.findById(req.body.accepted_request_id, (err, requestData)=>{
        if(err){ res.status(500).send({ message: err.message || "Failed to trace join request." }); return; }
        //needed: userId, whatToJoin, toJoinAs, idOfWhatToJoin ,fullName, nameOfWhatToJoin
        console.log("requestData.whatToJoin = ",requestData.whatToJoin);
        switch(requestData.whatToJoin){
            case "institution":
                console.log("<> user requested to join institution <>");
                //needed: idOfWhatToJoin, userId, toJoinAs
                if(requestData.toJoinAs=="staff"){
                    //insert into institution_staff collection
                    let newStaff = {
                        userId: requestData.userId,
                        institution: requestData.institution,
                        staffId: requestData.staffId,  //optional
                        fullName: requestData.fullName,
                        title: requestData.title
                    }
                    // associating the staff with the institution
                    const staffx = new InstitutionStaff(newStaff);
                    staffx.save((er, staf)=>{
                        if(er){ res.status(500).send({ message: er.message || 'Failed register to new staff' });  }
                        const updated = JoinRequest.findByIdAndUpdate(req.body.accepted_request_id, {status: "accepted"});
                        res.status(201).send({ message:'New staff registered'}); 
                    });
                }else if(requestData.toJoinAs=="student"){
                    //needed: idOfWhatToJoin, userId
                    //check if this user is already a learner, if not, register him as learner
                    const alearner = Learner.findOne({userId: requestData.userId}, (er, lrner)=>{
                        if(er){  
                            //an error occured 
                        }
                        //callback function to be used later
                        let feedBackCB = (returned) => {
                            if(returned.error){
                                console.log("User.acceptRequestsToJoin as student: InstitutionLearner.create(relationship), error =", returned.error);
                                cback(false);
                            }
                            if(returned.success){
                                console.log("User.acceptRequestsToJoin as student: InstitutionLearner.create(relationship), success=", returned.success);
                                cback(true);
                            }
                        } //end of callback definition
                        
                        if(lrner.userId && lrner._id){
                            //learner exists.
                            //create a learner-institution relationship
                            let relationship = {institution: requestData.idOfWhatToJoin, learner:lrner._id}; 
                            InstitutionLearner.create(relationship, feedBackCB);
                        }else{
                            //not a registered learner, so register first
                            let newlearnerdata = {
                                fullName: requestData.fullName,
                                userId: requestData.userId,
                                discipline: requestData.discipline,
                                completed: []
                            };
                            const newlearner = new Learner(newlearnerdata);
                            newlearner.save((er, newlrnr)=>{
                                if(er){ throw "Failed to register new learner"; }
                                //Now create a learner-institution relationship
                                let relationship = {institution: requestData.idOfWhatToJoin, learner:newlrnr._id}; 
                                InstitutionLearner.create(relationship, feedBackCB);
                            }); 
                        }
                        res.status(200).json({message: 'Client has joined the institution' });
                    }); 
                }
            case "discoussiongroup":
                console.log("<> user requested to join discoussiongroup <>");
                //needed: requestData.idOfWhatToJoin, requestData.userId, toJoinAs="member"
                const updatedgroup = DiscussionGroup.findByIdAndUpdate( requestData.idOfWhatToJoin, {$addToSet: {members: requestData.userId}} );
                res.status(200).json({message: 'Client has joined the discussion group' });
                break;
            case "classs":
                console.log("<> user requested to join classs <>");
                //needed: requestData.idOfWhatToJoin, requestData.userId, requestData.toJoinAs="member"
                //check if this user is already a learner, if not, register him as learner
                const alearner = Learner.findOne({userId: requestData.userId}, (er, lrner)=>{
                    if(er){  
                        //an error occured 
                    }
                    //callback function to be used later
                    let feedBackCB = (returned) => {
                        if(returned.error){
                            console.log("User.acceptRequestsToJoin as classs member: LearnerClasss.create(relationship), error =", returned.error);
                            cback(false);
                        }
                        if(returned.success){
                            console.log("User.acceptRequestsToJoin as classs member: LearnerClasss.create(relationship), success=", returned.success);
                            cback(true);
                        }
                    } //end of callback definition
                    
                    if(lrner.userId && lrner._id){
                        //learner exists.
                        //create a learner-institution relationship
                        let relationship = {classs: requestData.idOfWhatToJoin, learner:lrner._id}; 
                        InstitutionLearner.create(relationship, feedBackCB);
                    }else{
                        //not a registered learner, so register first
                        let newlearnerdata = {
                            fullName: requestData.fullName,
                            userId: requestData.userId,
                            discipline: requestData.discipline,
                            completed: []
                        };
                        const newlearner = new Learner(newlearnerdata);
                        newlearner.save((er, newlrnr)=>{
                            if(er){ throw "Failed to register new learner"; }
                            //Now create a learner-classs relationship
                            let relationship = {classs: requestData.idOfWhatToJoin, learner:newlrnr._id}; 
                            LearnerClasss.create(relationship, feedBackCB);
                        });
                    }
                    res.status(200).json({message: 'Client has joined the classs' });
                }); 
                break;
            case "alumnigroup":
                console.log("<> user requested to join alumnigroup <>");
                //needed: requestData.idOfWhatToJoin, requestData.userId, toJoinAs="member"
                const updatedclass = AlumniGroup.findByIdAndUpdate( requestData.idOfWhatToJoin, {$addToSet: {members: requestData.userId}} );
                res.status(200).json({message: 'Client has joined the alumni group' });
                break;
            default:
                console.log("<> user requested to join unknown <>");
                res.status(500).json({message: 'The client who requested to join did not specify what to join: institution,lumnigroup,classs,discussiongroup'});
            //do nothing
        } 
    });
  }catch (err) {
    res.status(500).json({message: err.message || 'Failed to record acceptance'});
  }
};

User.rejectRequestsToJoin = async (req, res) => {
  /* req.body = 
    {
      "rejected_request_id": "...", //must be a valid mongoose ObjectId
      "reason": "......"
    }
    
  */
  try {
    const updated = await JoinRequest.findByIdAndUpdate(req.body.rejected_request_id, {status: "rejected", whyRejected: req.body.reason });
    res.status(200).json({message: 'Join request was rejected successfully'});
  }catch(err){
    res.status(500).json({message: err.message || 'Failed to record rejection'});
  }
};
 

module.exports = { User };



