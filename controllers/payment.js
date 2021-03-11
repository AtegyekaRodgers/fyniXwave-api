const mongoose = require('mongoose');

const Payment = require('../models/payment');
const { checkIfloanIsBadDebt } = require('./check_bad_debts');

// Creating a new payment record
Payment.create = async (req, res) => {
  try {
    if(req.body.member_id && req.body.loan_id){
    //include static attributes of the payment instance
    let paymentInstance = {member_id:req.body.member_id, loan_id:req.body.loan_id, amountPaid:req.body.amountPaid};
    
    //process other (dynamic) attributes of the payment instance eg. interestPaid, principalPaid, etc
    paymentInstance.paymentDate = Date.now();
    
    let monthsElapsedSinceLastPayment = 1; //initially before the borrower makes any payment for their current loan
    
    
    let prevoiusOutstandingBalance = 0;
    
    
    //update monthsElapsedSinceLastPayment = <retreive this from database> and calculate 
    await Payment.findOne().sort({ paymentDate: -1 }).limit(1).exec((err, lastPaymnt)=>{
         if(err){ throw err.message || "Failure to retreive the borrower's outstanding balance"; }
         
         monthsElapsedSinceLastPayment = (new Date()).getMonth() - lastPaymnt.paymentDate.getMonth();
         
         //update prevoiusOutstandingBalance = <retreived from database>
         if(lastPaymnt && lastPaymnt.outstandingBalance){
            prevoiusOutstandingBalance = lastPaymnt.outstandingBalance;
         }
    });
    
    //if the time frame has not yet elapsed, interestPaid = <calculated> : otherwise interestPaid = 0;
    let isBadDebt = checkIfloanIsBadDebt(req.body.loan_id);  //returns true/false
    let interestPaid = (!isBadDebt) ? (((10/100) / (monthsElapsedSinceLastPayment/12)) * prevoiusOutstandingBalance) : 0;
    //The above means, if the member pays more than once during the same month, 
    //interest will be charged only once, the other times it will be zero because 
    //monthsElapsedSinceLastPayment = 0
    
    let principalPaid = req.body.amountPaid - interestPaid; 
    //From above line, if borrower has paid less than interest calculated, principalPaid will be negative. This means that
    // in the next uncommented line (below), the outcome of "(prevoiusOutstandingBalance - principalPaid)" will be 
    // (prevoiusOutstandingBalance minus minus principalPaid) which results into (math: -- = +) ->
    // (prevoiusOutstandingBalance + principalPaid). Hence the remaining -would be- interest is added to outstanding principal.
    
    let outstandingBalance = ((prevoiusOutstandingBalance - principalPaid) > 0) ? (prevoiusOutstandingBalance - principalPaid) : 0;
    
    paymentInstance.interestPaid = interestPaid;
    paymentInstance.principalPaid = principalPaid;
    paymentInstance.outstandingBalance = outstandingBalance;
    
    // new payment instance
    const payment = new Payment(paymentInstance);
    // saving the payment record
    payment.save((err, newpayment)=>{
        if(err){ throw err.message || "Sory, an error has occured while recording the payment"; }
         
        //TODO: if the new outstandingBalance is zero, update loan status from "ongoing" to "cleared"
        
        let responseData = { message: 'Payment successfully recorded', newpayment };  //newpayment = newpayment:newpayment
        res.status(201).send(responseData);
    }); 
    }else{
        let newpayment = {_id:null};
        let responseData = { message: 'member id or loan id missing, payment can not be made', newpayment };
        res.status(201).send(responseData);
    }
  }catch (err){
    let responseData = { message: err.message || 'An error occured while creating new payment record'};
    res.status(500).send(responseData);
  }
};
 
// Retrieve all payments
Payment.readAll = async (req, res) => {
  try {
    const payments = await Payment.find((err, paymentsFound)=>{
        if(err){ throw err.message || "Failed to retreive payment records"; }
        res.status(200).json(paymentsFound);
    });
  }catch (err) {
    let responseData = { message: err.message || 'An error occured while retrieving payments' };
    res.status(500).send(responseData);
  }
};
 
// Retrieve a specific payment
Payment.readOne = async (req, res) => {
  try {
    await Payment.findById(req.params.payment_id, (err, paymentFound)=>{
        if(err){ throw err.message || "Failed to retreive a payment record"; }
        res.status(200).json(paymentFound);
    });
  }catch (err) {
    console.log(err);
    let responseData = { message: err.message || 'An error occured while retrieving the payment record' };
    res.status(500).send(responseData); 
  }
};

// Retrieve payments by a particular member and for a particular loan
Payment.readByMember = async (req, res) => {
  try {
    let filters = req.query.loan_id ? {member_id:req.params.member_id, loan_id:req.query.loan_id} : {member_id:req.params.member_id};    
    const mpayments = await Payment.find( filters, (err, memberPayments)=>{
        if(err){ throw  err.message || "An error occured while retreiving the member's payment records"; }
        let responseData = {};
        //if atleast one record was found, then
        if(memberPayments && memberPayments.length && (memberPayments.length > 0)){
            //add memberPayments array to responseData object as an element
            responseData.memberPayments = memberPayments;
            //get total amountPaid
            let totalAmountPaid = eval(memberPayments.map((pymt)=>{ return (!isNaN(pymt.amountPaid)) ? pymt.amountPaid : 0; }).join('+'));
            //get total interestPaid
            let totalInterestPaid = eval(memberPayments.map((pymt)=>{ return (!isNaN(pymt.interestPaid)) ? pymt.interestPaid : 0; }).join('+'));
            //get total principalPaid
            let totalPrincipalPaid = eval(memberPayments.map((pymt)=>{ return (!isNaN(pymt.principalPaid)) ? pymt.principalPaid : 0; }).join('+'));
            //get total outstandingBalance
            let totalOutstandingBalance = eval(memberPayments.map((pymt)=>{ return (!isNaN(pymt.outstandingBalance)) ? pymt.outstandingBalance : 0; }).join('+'));    
            eval([1,2,3].join('+'))
            //add the above totals to responseData object
            responseData.totalAmountPaid = totalAmountPaid;
            responseData.totalInterestPaid = totalInterestPaid;
            responseData.totalPrincipalPaid = totalPrincipalPaid;
            responseData.totalOutstandingBalance = totalOutstandingBalance;
        }
        res.status(200).send(responseData);
    });
  }catch (err) {
    let responseData = { message: err.message || 'An error occured while retrieving payment records' };
    res.status(500).send(responseData);
  }
};

module.exports = { Payment };


 
