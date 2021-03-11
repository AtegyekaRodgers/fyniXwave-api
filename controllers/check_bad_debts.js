

let checkIfloanIsBadDebt = ( target_loan_id ) => {
    //TODO: query db for details of this particular loan
    //if current date (today) is later than startDate of the loan,
        //if loan status is still marked as "ongoing", update it to "bad_debt"
        //return true; implying that the loan is a bad debt
    //else, 
        return false;
};


module.exports = { checkIfloanIsBadDebt };
