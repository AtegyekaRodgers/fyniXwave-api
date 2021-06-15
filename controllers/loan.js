
const Loan = require('../models/loan');
const {makeNewLoan} = require('../entities/loan');
const {loanDb} = require('../data-access/loan');

const ratingPeriodToInstalmentDuration = 
   { anum: { day:365.25, week: 52.1785714, month: 12, quarter: 4, semi: 2, year:1 },
     semi: { day:182.625, week: 26.0892857, month: 6, quarter: 2, semi: 1, year:0.5 },
     quarter: { day:91.311, week: 13.0446429, month: 3, quarter: 1, semi: 0.5, year:0.25 },
     month: { day:30.4375, week: 4.34821429, month: 1, quarter: 0.33333334, semi: 0.166666667, year:0.08333333333 },
     week: { day:7, week: 1, month: 0.229979466, quarter: 0.0766598218, semi: 0.038329911, year:0.0191649555 },
     day: { day:1, week: 0.142857143, month: 0.0328542094, quarter: 0.0109515831, semi: 0.00547570157, year:0.00273785079 }
   }
                           
const loanDurationToRatingPeriodMatrix = 
   { years: { day:365.25, week: 52.1785714, month: 12, quarter: 4, semi: 2, anum:1 },
     semis: { day:182.625, week: 26.0892857, month: 6, quarter: 2, semi: 1, anum:0.5 },
     quarters: { day:91.311, week: 13.0446429, month: 3, quarter: 1, semi: 0.5, anum:0.25 },
     months: { day:30.4375, week: 4.34821429, month: 1, quarter: 0.33333334, semi: 0.166666667, anum:0.08333333333 },
     weeks: { day:7, week: 1, month: 0.229979466, quarter: 0.0766598218, semi: 0.038329911, anum:0.0191649555 },
     days: { day:1, week: 0.142857143, month: 0.0328542094, quarter: 0.0109515831, semi: 0.00547570157, anum:0.00273785079 }
   }
   
       const calculateEMI = ({
        principalAmount, 
        interestRatedPer, 
        instalmentsToBePer, 
        loanInterestRate, 
        loanToLastFor = 3, 
        loanToLastForDurationType = "years"
      }) => {
        /* ==Theory=======
        
                     R(1+r)^N
         EMI  = P x ----------
                    ((1+r)^N)−1

         P = Principal borrowed
         R = annual interest rate
         r = Periodic interest rate (annual interest rate/12)
         N = Total number of payment (number of months during the loan tenure)
         
         Example:
         A borrower takes a $100,000 loan with 8.5% annual interest rate for three years.
         (P=100000 , r=0.085/12 , N=3*12 )
         
              0.085(1 + (0.085/12))^36
         P x -------------------------
               ((1+(0.085/12))^36)-1
         
        ======================================================
        */
        
        //==defaults:==
        // instalmentsPerRatingPeriod = 12
        // ratingPeriod = "anum"
        // totalInstalments = 36
        
        let ratingPeriodsInOneLoanDurationType = loanDurationToRatingPeriodMatrix[loanToLastForDurationType][interestRatedPer];
        const instalmentsPerRatingPeriod = ratingPeriodToInstalmentDuration[interestRatedPer][instalmentsToBePer];
        let totalRatingPeriods = loanToLastFor * ratingPeriodsInOneLoanDurationType;
        totalInstalments = instalmentsPerRatingPeriod * totalRatingPeriods;
        
        let percentageRate = loanInterestRate/100;
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        const P = principalAmount;
        let   R = percentageRate;
        let   r = percentageRate/instalmentsPerRatingPeriod;
        let   n = instalmentsPerRatingPeriod;
        let   N = totalInstalments; // n*3
        //let LoanEMI = (P *( 0.085 * ( (1 + (0.085/12) )^36))) / (((1+r)^36)-1);
          let LoanEMI = (P *( R * ((1+r)^N))) / (((1+r)^N)-1);
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        let payingPer = instalmentsToBePer=="year" ? "anum" : instalmentsToBePer;
        let EMIinInstalmentTime  = LoanEMI * ratingPeriodToInstalmentDuration[payingPer].month;
        
        return EMIinInstalmentTime;
    }

    const determineEndDate = ({
      loanToLastFor = 3, 
      loanToLastForDurationType = "years" 
    } = {}) => {
        let totalDays = loanToLastFor * loanDurationToRatingPeriodMatrix[loanToLastForDurationType].day;
        let calculatedEndDate = new Date( Date.now() + (totalDays * 24 * 60 * 60 * 1000));
        return calculatedEndDate;
    }

// Creating a new loan record
Loan.create = async (req, res) => {
  try {
    const {
        memberId,
        loanInterestRate,           // default: 10%
        interestRatedPer,           // default: "anum"
        instalmentsToBePer,         // default: "month"
        loanToLastFor,              // eg: 3, default: 2
        loanToLastForDurationType,  // default: "years"
        principalAmount,
        loanStartDate,              //optional, in case start date is different from this date when loan is registered.
    } = req.body;
    
    //calculate EMI
    let newLoanEMI = calculateEMI({
           interestRatedPer, 
           instalmentsToBePer, 
           principalAmount, 
           loanInterestRate, 
           loanToLastFor,
           loanToLastForDurationType 
     });
    
    let newLoanRecord = {
        memberId,
        loanInterestRate,
        interestRatedPer, 
        instalmentsToBePer,
        loanToLastFor, 
        loanToLastForDurationType,
        principalAmount,
        loanStartDate,
        EMIamount: newLoanEMI,
        endDate: determineEndDate({ loanToLastFor, loanToLastForDurationType })
    };
    
    // new loan instance
    const loan = makeNewLoan(newLoanRecord);
    
    // saving the record
    const inserted = await loanDb.insert({
      loanId: loan.getId(),
      memberId: loan.getMemberId(),
      principalAmount: loan.getPrincipalAmount(),
      loanInterestRate: loan.getLoanInterestRate(), 
      interestRatedPer: loan.getInterestRatedPer(), 
      instalmentsToBePer: loan.getInstalmentsToBePer(),
      loanToLastFor: loan.getLoanToLastFor(), 
      loanToLastForDurationType: loan.getLoanToLastForDurationType(),
      EMIamount: loan.getEMIamount(),
      loanStartDate: loan.getLoanStartDate(),
      loanStatus: loan.getLoanStatus(),
      endDate: loan.getEndDate(),
    });
    let responseData = { message: 'Loan successfully recorded', ...inserted };
    res.status(201).send(responseData);
  }catch (err){
    console.log(err);
    let responseData = { message: err.message || 'An error occured while creating new loan record'};
    res.status(500).send(responseData);
  }
};
 
// Retrieve all loans
Loan.readAll = async (req, res) => {
  try {
    const loans = await loanDb.findAll();
    res.status(200).send(loans);
  }catch (err) {
    console.log(err);
    let responseData = { message: err.message || 'An error occured while retrieving loans' };
    res.status(500).send(responseData);
  }
};
 
// Retrieve a specific loan
Loan.readOne = async (req, res) => {
  
  try {
    const loan = await loanDb.findByHash({ hash: req.params.loan_id });
    res.status(200).send(loan);
  }catch (err) {
    console.log(err);
    let responseData = { message: err.message || 'An error occured while retrieving the loan record' };
    res.status(500).send(responseData); 
  }
};

module.exports = { Loan };



