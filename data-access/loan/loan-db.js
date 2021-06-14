const { members, loans, payments } = require('../../schema');

module.exports.makeLoanDb  =  function() {
  return Object.freeze({
    findByHash,
    findAll,
    updateByHash,
    insert,
  });

   
  async function insert(loanObject) {
    const newLoanId = loans.add(loanObject);
    return {id:newLoanId, ...loanObject };
  }

  async function findByHash({ hash }) {
   const loan = loans.readOne({loanId: hash});
   return loan;
  }
  
  async function findAll() {
   const loanss = loans.readAll();
   return loanss;
  }
  
  async function updateByHash({
         loanId, 
         memberId, 
         principalAmount,
         loanInterestRate, 
         interestRatedPer, 
         instalmentsToBePer,
         loanToLastFor, 
         loanToLastForDurationType,
         EMIamount, 
         loanStartDate, 
         loanStatus, 
         endDate
      } = {}) {
      
        loans.update({
          loanId, 
          memberId, 
          principalAmount, 
          loanInterestRate, 
          interestRatedPer, 
          instalmentsToBePer,
          loanToLastFor, 
          loanToLastForDurationType,
          EMIamount, 
          loanStartDate, 
          loanStatus, 
          endDate
        });
  }
    
}
