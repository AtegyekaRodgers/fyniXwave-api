const makeNewLoan = ({
  loanId,
  memberId,
  principalAmount,
  loanInterestRate, 
  interestRatedPer, 
  instalmentsToBePer,
  loanToLastFor, 
  loanToLastForDurationType,
  EMIamount,
  loanStartDate = new Date(),
  loanStatus = "ONGOING",  //enum: ["ONGOING","CLEARED","BAD_DEBT"]
  endDate,
} = {}) => {
    try{
        
        if (!memberId) {
          throw new Error('Member Id is required.');
        }
        
        const isValidLoanStatus = status => {
          const ONGOING = 'ONGOING';
          const CLEARED = 'CLEARED';
          const BAD_DEBT = 'BAD_DEBT';
          return [ONGOING, CLEARED, BAD_DEBT].includes(status);
        };
        
        if (!isValidLoanStatus(loanStatus)) {
          throw new Error('Invalid loan status.');
        }
        
        return Object.freeze({
          getId: () => loanId,
          getMemberId: () => memberId,
          getPrincipalAmount: () => principalAmount,
          getLoanInterestRate: () => loanInterestRate,
          getInterestRatedPer: () => interestRatedPer,
          getInstalmentsToBePer: () => instalmentsToBePer,
          getLoanToLastFor: () => loanToLastFor,
          getLoanToLastForDurationType: () => loanToLastForDurationType,
          getEMIamount: () => EMIamount,
          getLoanStartDate: () => loanStartDate,
          getLoanStatus: () => loanStatus,
          getEndDate: () => endDate
        });
        
    }catch (err){
      console.log(err);
      return { error: err.message || "An error occured while validating loan data" }
    }
    
};

module.exports =  { makeNewLoan };


