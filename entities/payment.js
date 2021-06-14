const makeNewPayment = ({
   paymentId,
   loanId,
   memberId,
   amountPaid, 
   interestPaid, 
   principalPaid, 
   outstandingBalance, 
   paymentDate = new Date(),
} = {}) => {
    try{
        
        if (!memberId) {
          throw new Error('Member Id is required.');
        }
        if (!loanId) {
          throw new Error('Loan Id is required.');
        }
        
        return Object.freeze({
           getId : () => paymentId,
           getLoanId: () => loanId,
           getMemberId: () => memberId,
           getAmountPaid: () => amountPaid, 
           getInterestPaid: () => interestPaid, 
           getPrincipalPaid: () => principalPaid, 
           getOutstandingBalance: () => outstandingBalance, 
           getPaymentDate: () => paymentDate,
        });
        
    }catch (err){
      console.log(err);
      return { error: err.message || "An error occured while validating payment data" }
    }
    
};

module.exports =  { makeNewPayment };


