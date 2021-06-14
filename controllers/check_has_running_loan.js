const Loan = require('../models/loan');
const Payment = require('../models/payment');

let hasNoRunningLoan = ( args ) => {
    //select last record from 'loans' table/collection where member_id = args.member_id
    Loan.findOne().sort({ dateStarted: -1 }).limit(1).exec((err, latestLoan)=>{
        if(err){ console.log(err.message || "Failed to verify member eligibilty for a loan."); return false; }
        //select last payment record from payments table/collection where loan_id = <id-of-the-loan-retreived-above>
        Payment.findOne().sort({ paymentDate: -1 }).limit(1).exec((err, lastPaymnt)=>{
             if(err){ console.log(err.message || "Failure to verify member eligibilty for a loan."); return false; }
             if(lastPaymnt && lastPaymnt.outstandingBalance){
                if(lastPaymnt.outstandingBalance > 0){
                    return false; //Implying that the member has another running loan
                }else{
                    return true;
                }
             }
        });
    });
};

module.exports = { hasNoRunningLoan };
