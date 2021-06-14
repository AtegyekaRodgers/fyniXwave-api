
const Payment = require('../models/payment');
const { checkIfloanIsBadDebt } = require('./check_bad_debts');
const {paymentDb} = require('../data-access/payment');
const {loanDb} = require('../data-access/loan');
const {makeNewPayment} = require('../entities/payment');

// Creating a new payment record
Payment.create = async (req, res) => {
  try {
    const { memberId, loanId, amountPaid };
    
    //first include static paramenters of the payment instance
    let paymentInstance = { memberId, loanId, amountPaid };
    
    //process and include other (dynamic) parameters of the payment instance eg. interestPaid, principalPaid, etc
    paymentInstance.paymentDate = new Date();
    
    let instalmentsElapsedSinceLastPayment = 1; // initially before the borrower makes any payment for their current loan
    
    let targetLoan = await loanDb.findByHash({hash:paymentInstance.loanId});
    
    let prevoiusOutstandingBalance = targetLoan.principalAmount;
    
    //update instalmentsElapsedSinceLastPayment = <retreive this from database> and calculate 
    let lastPaymnt = await paymentDb.findLastByMember(paymentInstance.memberId);
    
     if(lastPaymnt && lastPaymnt.paymentDate){
        instalmentsElapsedSinceLastPayment = Number((new Date()).getMonth() - lastPaymnt.paymentDate.getMonth());
        //TODO: calculate it considering other instalment periods, not only month.
        //      the above is only considering monthly instalments, hence using the getMonth() function to 
        //      get months elapsed since borrower last made a payment. 
        //TODO: We need to get weeks elapsed in case instalments are per week, days in case instalments are per day, etc
     }
     
     //update prevoiusOutstandingBalance = <retreived from database>
     if(lastPaymnt && lastPaymnt.outstandingBalance){
        prevoiusOutstandingBalance = lastPaymnt.outstandingBalance;
     }
    
    //if the time frame has not yet elapsed, interestPaid = <calculated> : otherwise interestPaid = 0;
    let isBadDebt = checkIfloanIsBadDebt(loanId);  //returns true/false
    let delayFinePercentage = 0;
    if(instalmentsElapsedSinceLastPayment>1){
        //apply delay fine: fine rate 20% of the interest
        delayFinePercentage = (20/100) * instalmentsElapsedSinceLastPayment;
    }
    
    let loanInterestRate = targetLoan.loanInterestRate/100;  // default: 10%
    const interestRatedPer = targetLoan.interestRatedPer; // default: "anum"
    const instalmentsToBePer = targetLoan.instalmentsToBePer; // default: "month"
    const loanToLastFor = targetLoan.loanToLastFor; // eg: 3, default: 2
    const loanToLastForDurationType = targetLoan.loanToLastForDurationType; // default: "years"
    
    const ratingPeriodToInstalmentDuration = 
       { anum: { day:366, week: 54, month: 12, quarter: 4, semi: 2, year:1 },
         semi: { day:183, week: 27, month: 6, quarter: 2, semi: 1, year:0.5 },
         quarter:{ day:91, week: 13.5, month: 3, quarter: 1, semi: 0.5, year:0.25 },
         month: { day:31, week: 4.4, month: 1, quarter: 0.33, semi: 0.167, year:0.083 },
         week: { day:7, week: 4.4, month: 0.228, quarter: 0.074, semi: 0.037, year:0.018 },
         day: { day:1, week: 0.143, month: 0.032, quarter: 0.011, semi: 0.005, year:0.003 }
       }
    const totalInstalmentsPerRatingPeriod = ratingPeriodToInstalmentDuration[interestRatedPer][instalmentsToBePer];
    
    let interestToBePaid = (loanInterestRate * (instalmentsElapsedSinceLastPayment/totalInstalmentsPerRatingPeriod) ) * prevoiusOutstandingBalance;
    //Example: let interestToBePaid = (0.085 * (1/12) ) * 100000;
    let interestPaid = (!isBadDebt) ? interestToBePaid : 0;
    interestPaid = (delayFinePercentage * interestToBePaid) + interestPaid;
    //The above means, if the member pays more than once during the same instalment period (month),
    //interest will be charged only once, the other times it will be zero because 
    //instalmentsElapsedSinceLastPayment = 0
    
    let principalPaid = amountPaid - interestPaid;
    //From above line, if borrower has paid less than interest calculated, principalPaid will be negative. This means that
    // in the next uncommented line (below), the outcome of "(prevoiusOutstandingBalance - principalPaid)" will be 
    // (prevoiusOutstandingBalance minus minus principalPaid) which results into (math: -- = +) ->
    // (prevoiusOutstandingBalance + principalPaid). Hence the remaining -would be- interest is added to outstanding principal.
    
    let outstandingBalance = ((prevoiusOutstandingBalance - principalPaid) > 0) ? (prevoiusOutstandingBalance - principalPaid) : 0; //0 means loan cleared
    
    //add the calculated (dynamic) parameters to paymentInstance object needed later
    paymentInstance.interestPaid = interestPaid;
    paymentInstance.principalPaid = principalPaid;
    paymentInstance.outstandingBalance = outstandingBalance;
    
    // new payment instance, using entity layer
    const payment = makeNewPayment(paymentInstance);
    
    //if the new outstandingBalance is zero, update loan status from "ongoing" to "cleared"
    if (outstandingBalance < 1) {
        loanDb.updateByHash({loanId:paymentInstance.loanId, loanStatus:"CLEARED"});
    }
    // save the payment record now
    const inserted = await paymentDb.insert({
       paymentId: payment.getId(),
       loanId: payment.getLoanId(),
       memberId: payment.getMemberId(),
       amountPaid: payment.getAmountPaid(), 
       interestPaid: payment.getInterestPaid(), 
       principalPaid: payment.getPrincipalPaid(), 
       outstandingBalance: payment.getOutstandingBalance(), 
       paymentDate: payment.getPaymentDate(),
    });
    
    let responseData = { message: 'Payment successfully recorded', ...inserted };
    res.status(201).send(responseData);
    
  }catch (err){
    let responseData = { message: err.message || 'An error occured while creating new payment record'};
    res.status(500).send(responseData);
  }
};
 
// Retrieve all payments
Payment.readAll = async (req, res) => {
  try {
    const payments = await paymentDb.findAll();
    res.status(200).send(payments);
  }catch (err) {
    console.log(err);
    let responseData = { message: err.message || 'An error occured while retrieving payments' };
    res.status(500).send(responseData);
  }
};
 
// Retrieve a specific payment
Payment.readOne = async (req, res) => {
  try {
    const payment = await paymentDb.findByHash({ hash: req.params.payment_id });
    res.status(200).send(payment);
  }catch (err) {
    console.log(err);
    let responseData = { message: err.message || 'An error occured while retrieving the loan record' };
    res.status(500).send(responseData); 
  }
};

// Retrieve payments by a particular member and for a particular loan
Payment.readByMember = async (req, res) => {
  try {
    const {memberId, loanId} = req.params;
     
    let mpayments = await paymentDb.findAllByMember({memberId, loanId}, (memberPayments) => {
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


 
