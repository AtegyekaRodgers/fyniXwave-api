const { payments } = require('../../schema');

module.exports.makePaymentDb  =  function () {
  return Object.freeze({
    findByHash,
    findAll,
    findLastByLoanId,
    findAllByMember,
    updateByHash,
    insert,
  });

   
  async function insert(paymentObject) {
    const newLoanId = payments.add(paymentObject);
    return {id:newLoanId, ...paymentObject };
  }

  async function findByHash({ hash }) {
   const payment = payments.readOne({paymentId: hash});
   return payment;
  }
  
  async function findAll() {
   const paymentss = payments.readAll();
   return paymentss;
  }
  
  async function findLastByLoanId({ loanId }) {
   const lastPayment = payments.readLastByLoanId({ loanId });
   return lastPayment;
  }
  
  async function findAllByMember({memberId, loanId}, cback ) {
   const paymentss = payments.readAllByMember({memberId, loanId});
   cback(paymentss);
  }

  async function updateByHash({
     paymentId, 
     memberId, 
     loanId, 
     amountPaid, 
     interestPaid, 
     principalPaid, 
     outstandingBalance, 
     paymentDate 
  } = {}) {
  
    payments.update({
        paymentId, 
        memberId, 
        loanId, 
        amountPaid, 
        interestPaid, 
        principalPaid, 
        outstandingBalance, 
        paymentDate 
    });
  
  }
    
}
