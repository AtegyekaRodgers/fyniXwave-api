const mongoose = require('mongoose');

const Loan = require('../models/loan');

// Creating a new loan record
Loan.create = async (req, res) => { 
  try {
    //calculate EMI 
    let N_days = 93; //3 months
    let P = req.body.principalAmount;
    let newLoanEMI = (P * (10/(12*100)) * ((1+(10/(12*100)))^3))/(((1+(10/(12*100)))^3)-1);
    let calculatedEndDate = new Date( Date.now() + (N_days * 24 * 60 * 60 * 1000));
    let newLoanRecord = {
        member_id: req.body.member_id,
        principalAmount: req.body.principalAmount,
        EMIamount: newLoanEMI,
        //dateStarted: { type: Date, default: Date.now() },
        //loanStatus: { type: String, enum: ["ongoing","cleared","bad_debt"], default: "ongoing" },
        endDate: calculatedEndDate
    };
    
    // new loan instance
    const loan = new Loan(newLoanRecord);
    // saving the record
    loan.save((err, newloan)=>{
        if(err){ throw err.message || "Sory, an error has occured while recording the loan"; }
        let responseData = { message: 'Loan record successfully created', newloan }; //newloan = newloan:newloan
        res.status(201).send(responseData);
    }); 
  }catch (err){
    console.log(err);
    let responseData = { message: err.message || 'An error occured while creating new loan record'};
    res.status(500).send(responseData);
  }
};
 
// Retrieve all loans
Loan.readAll = async (req, res) => {
  try {
    const loans = await Loan.find((err, loansFound)=>{
        if(err){ throw err.message || "Failed to retreive loan records"; }
        res.status(200).json(loansFound);
    });
  }catch (err) {
    console.log(err);
    let responseData = { message: err.message || 'An error occured while retrieving loans' };
    res.status(500).send(responseData);
  }
};
 
// Retrieve a specific loan
Loan.readOne = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loan_id, (err, loanFound)=>{
        if(err){ throw err.message || "Failed to retreive a loan record"; }
        res.status(200).json(loanFound);
    });
  }catch (err) {
    console.log(err);
    let responseData = { message: err.message || 'An error occured while retrieving the loan record' };
    res.status(500).send(responseData); 
  }
};

// Retrieve loans for a particular member
Loan.readByMember = async (req, res) => {
  try {
    const mloans = await Loan.find({member_id:req.params.member_id},(err, memberLoans)=>{
        if(err){ throw  err.message || "An error occured while retreiving the member's loan records"; } 
        res.status(200).send(memberLoans);
    }); 
  }catch (err) {
    console.log(err);
    let responseData = { message: err.message || 'An error occured while retrieving loans' };
    res.status(500).send(responseData);
  }
};

module.exports = { Loan };



