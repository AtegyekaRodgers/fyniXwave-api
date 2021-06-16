const mongoose = require('mongoose');

const Member = {};
const { hasNoRunningLoan } = require('./check_has_running_loan');

// Creating a new member profile
Member.create = async (req, res) => {
  try {
    // new member profile
    const member = new Member(req.body);
    // saving the profile
    member.save((err, newmember)=>{
        if(err){ throw err.message || "Sory, an error has occured while saving the member profile "; }
        let responseData = { message: 'Member profile successfully created', _id: newmember._id };
        res.status(201).send(responseData);
    }); 
  }catch (err){
    console.log(err);
    let responseData = { message: err.message || 'An error occured while creating new member profile'};
    res.status(500).send(responseData);
  }
};
 
// Retrieve all members
Member.readAll = async (req, res) => {
  try {
    await Member.find((err, membersFound)=>{
        if(err){ throw err.message || "Failed to retreive members"; }
        res.status(200).json(membersFound);
    }); 
  }catch (err){
    console.log(err);
    let responseData = { message: err.message || 'An error occured while retrieving member profile details' };
    res.status(500).send(responseData);
  }
};
 
// Retrieve a specific member profile
Member.readOne = async (req, res) => {
  try {
    const member = await Member.findById(req.params.member_id, (err, memberFound)=>{
        if(err){ throw err.message || "Failed to retreive a member"; }
        res.status(200).json(memberFound);
    });
  }catch (err) {
    console.log(err);
    let responseData = { message: err.message || 'An error occured while retrieving the member profile' };
    res.status(500).send(responseData); 
  }
};

// Retreive a specific member profile
Member.takeLoan = async (req, res, next) => {
  try {
     if(req.body.member_id && hasNoRunningLoan({member_id: req.body.member_id})){
        next();
     }else{
        let newloan = {_id: null}; //This is for the system not to crash in case the member already has a running loan
        //member can not take loan, respond with the excuse
        let responseData = { message: `Sorry, you can not take another loan before you clear all outstanding loans.
        If you think this feedback is an error, please contact us.`, newloan };
        res.status(201).send(responseData);
     }
  }catch (err) {
    console.log(err);
    let responseData = { message: err.message || 'An error occured while processing loan request. Please try again' };
    res.status(500).send(responseData); 
  }
};
 

module.exports = { Member };



