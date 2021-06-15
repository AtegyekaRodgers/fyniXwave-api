
const Payment = {};
const { checkIfloanIsBadDebt } = require('./check_bad_debts');
const {paymentDb} = require('../data-access/payment');
const {loanDb} = require('../data-access/loan');
const {makeNewPayment} = require('../entities/payment');
const ratingPeriodToInstalmentDuration = 
{anum: { day:365.25, week: 52.1785714, month: 12, quarter: 4, semi: 2, year:1 },
 semi: { day:182.625, week: 26.0892857, month: 6, quarter: 2, semi: 1, year:0.5 },
 quarter: { day:91.311, week: 13.0446429, month: 3, quarter: 1, semi: 0.5, year:0.25 },
 month: { day:30.4375, week: 4.34821429, month: 1, quarter: 0.33333334, semi: 0.166666667, year:0.08333333333 },
 week: { day:7, week: 1, month: 0.229979466, quarter: 0.0766598218, semi: 0.038329911, year:0.0191649555 },
 day: { day:1, week: 0.142857143, month: 0.0328542094, quarter: 0.0109515831, semi: 0.00547570157, year:0.00273785079 }
}

//============================= functions to be used: ==========================
const getInstalmentsElapsedSinceLastPayment = ({targetLoan, lastPayment} = {}) => {
   let instalmentsElapsedSinceLastPayment = 1;
   if(lastPayment && lastPayment.paymentDate){
     let differenceInMinutes = (new Date()).getMinutes() - lastPayment.paymentDate.getMinutes();
     const minutesInOneHour = 60;
     const hoursInOneDay = 24;
     let totalMinutesInOneDay = minutesInOneHour * hoursInOneDay;
     let daysElapsed = differenceInMinutes / totalMinutesInOneDay;
     let numberOfDaysInInstalmentPeriod = ratingPeriodToInstalmentDuration[targetLoan.instalmentsToBePer].day;
     instalmentsElapsedSinceLastPayment = numberOfDaysInInstalmentPeriod / daysElapsed;
   }
   return instalmentsElapsedSinceLastPayment;
};

const enforceDelayFine = ({targetLoan, fineRate = 20, ov, lastPayment, interestToBePaid }) => {
    let delayFine = 0;
    const instalmentsElapsed = getInstalmentsElapsedSinceLastPayment({targetLoan, lastPayment});
    if(instalmentsElapsed > 1){
       if (ov && (typeof ov === "number")){
          delayFine = ((fineRate/100) * ov) * instalmentsElapsed;
       }
    }
    return delayFine + interestToBePaid;
}
 
const calculateInstalmentInterest = ({
    targetLoan,
    prevoiusOutstandingBalance,
    totalInstalmentsPerRatingPeriod,
    lastPayment,
}) => {
     let percentageInterestRate = targetLoan.loanInterestRate/100;
     let instalmentsElapsed = getInstalmentsElapsedSinceLastPayment({targetLoan, lastPayment});
     let x = instalmentsElapsed;
     let y = totalInstalmentsPerRatingPeriod;
     let obal = targetLoan.prevoiusOutstandingBalance;
     let r = percentageInterestRate;
     let instalmentInterest = (r * (x/y)) * obal;
     //The above means, if the member pays more than once during the same instalment period,
     //interest will be charged only once, the other times it will be zero because, 
     //instalmentsElapsed = 0
     // ie, from the formula above, (x/y) = (0/y) = 0
     interestToBePaid = (!checkIfloanIsBadDebt(targetLoan.loanId)) ? instalmentInterest : 0;
     return interestToBePaid;
};

const getPreviousOutstandingBalance = ({targetLoan, lastPayment }) => {
    let prevoiusOutstandingBalance = targetLoan.principalAmount;
    if(lastPayment && lastPayment.outstandingBalance){
       prevoiusOutstandingBalance = lastPayment.outstandingBalance;
    }
    return prevoiusOutstandingBalance;
}

const calculatePrincipalPaid = ({ amountPaid, interestPaid }) => {
    let principalPaid = amountPaid - interestPaid;
    //From above line, if borrower has paid less than interest calculated (interestPaid), 
    //principalPaid will be negative. This means that
    // "(prevoiusOutstandingBalance - principalPaid)" will be 
    // (prevoiusOutstandingBalance minus minus principalPaid) which results into (math: -- = +) ->
    // (prevoiusOutstandingBalance + principalPaid). 
    // Hence the remaining -would be- interest is added to outstanding principal balance.
    return principalPaid;
};

const updateOutstandingBalance = ({prevoiusOutstandingBalance, principalPaid} = {}) => {
    try {
        if(!prevoiusOutstandingBalance || !principalPaid){
            throw "prevoiusOutstandingBalance and principalPaid are required fields.";
        }
        let x = prevoiusOutstandingBalance;
        let y = principalPaid;
        return ((x - y) > 0) ? (x - y) : 0; //0 means loan cleared
    }catch(err){
        return err.message || "An error has occured while updating the outstanding balance";
    }
};

//============================= API endpoints below: ==========================

Payment.create = async (req, res) => {
  try {
    const { memberId, loanId, amountPaid } = req.body;
    
    //first include static paramenters of the payment instance
    let paymentInstance = { memberId, loanId, amountPaid };
    
    let   targetLoan  = await loanDb.findByHash({ hash: loanId });
    const lastPayment = await paymentDb.findLastByLoanId({ loanId });
    
    const { interestRatedPer,          // default: "anum"
            instalmentsToBePer,        // default: "month"
            loanToLastFor,             // eg: 3, default: 2
            loanToLastForDurationType, // default: "years"
            loanInterestRate,          // default: 8.5%
          } = targetLoan;
    const totalInstalmentsPerRatingPeriod = ratingPeriodToInstalmentDuration[interestRatedPer][instalmentsToBePer];
          
    const prevoiusOutstandingBalance = getPreviousOutstandingBalance({targetLoan, lastPayment });
    
    let interestToBePaid = calculateInstalmentInterest({
        targetLoan,
        prevoiusOutstandingBalance,
        totalInstalmentsPerRatingPeriod,
        lastPayment,
    });
    
    const interestPaid = enforceDelayFine({targetLoan, fineRate:15, ov:interestToBePaid, lastPayment, interestToBePaid });
    const principalPaid = calculatePrincipalPaid({amountPaid, interestPaid });
    const outstandingBalance = updateOutstandingBalance({prevoiusOutstandingBalance, principalPaid});
    
    //add the calculated (dynamic) parameters to paymentInstance object needed later
    paymentInstance.interestPaid = Math.round(interestPaid);
    paymentInstance.principalPaid = Math.round(principalPaid);
    paymentInstance.outstandingBalance = Math.round(outstandingBalance);
    
    // new payment instance, using entity layer
    const payment = makeNewPayment(paymentInstance);
    
    //if the new outstandingBalance is zero, update loan status from "ONGOING" to "CLEARED"
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


 
