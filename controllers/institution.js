const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const Institution = require('../models/institution');
const { sendEmails } = require('./send_emails');


// Creating a new institution profile
Institution.create = async (req, res) => {
    /* req.body = 
    {
        "institutionName": "Delv",
        "location": "603f8538ab61df4327543280",
        "admins": ["603f47b30659d72147b9506a"],
        "alumniGroup": null
    }
    */ 
  
  try {
    // saving the profile
    const institution = new Institution(req.body);
    await institution.save();
    res.status(201).json({ message: 'Institution profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new institution profile',
    });
  }
};

// Adding or updating profile picture for an institution
Institution.updateProfilePicture = async (req, res) => {
   try {
   // uploading profile picture to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error) => {
        if (error) console.log(error);
    });
    
    let institution = await Institution.findById(req.query.id);
    const updated = await Institution.findByIdAndUpdate(
      {_id: req.query.id },
      { profilePicture: result.secure_url || institution.profilePicture, cloudinaryId: result.public_id },
      { useFindAndModify: false },
    );
    res.status(200).json({newlink: updated.profilePicture}); //return the link to the new profile picture
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while updating the profile picture',
    });
  }
};

// Retrieve all institutions
Institution.readAll = async (req, res) => {
  try {
    const institutions = await Institution.find();
    res.status(200).json(institutions);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving institutions',
    });
  }
};

// Retrieve single institution
Institution.readOne = async (req, res) => {
  try {
    const institution = await Institution.findById(req.query.id);
    res.json(institution);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this institution',
    });
    console.log(err);
  }
};

Institution.sendSurveys = async (req, res) => {
  /*
    {
      "topic": "Topic of the survey",
      "link": "https://some-link-to-the-survey-page.com/questions",
      "email_message": "This is the message that users will see. It's a summary of what the survey is 
                        all about also telling them to click the link for them to respond to the 
                        survey questions. "
    }
  */
  try {
    //unpack the request and prepare the message
    
    //retreive all user emails to which we want to send the survey 
    const usrs = await User.find({}, (err, users)=>{
        if(err){ throw err.message || "Could not retreive the target emails to which we want to send surveys"; }
        if((!users) || (!users.length) || (users.length<=0)){
            res.status(200).send({message: "There are no users to send surveys to"});
        }
        let targetEmails = users.map((usr)=>{ return usr.email; });
        //send the emails
        sendEmails({to: targetEmails, link: "http://195.201.136.61:9900/" });
        //respond to the client
        res.status(200).send({message: "surveys sent successfully"});
    }); 
  }catch (err) {
    console.log(err);
    res.status(500).send({message: err.message || 'An error occured while sending the survey to users/participants'});
  }
};

module.exports = { Institution };



