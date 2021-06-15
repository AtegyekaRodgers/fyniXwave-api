
//=========members========

let members = {
    I4464998563046501: {name: "Tomothy Batabaire", phoneNumber: "0781224508", address: "Kyenjojo"}, 
    I4564998563046502: {name: "Aaron Mutebi", phoneNumber: "0781224509", address: "Entebbe"},
    I4664998563046503: {name: "Baguma Stuart", phoneNumber: "0781224510", address: "Mbarara"},
    I4764998563046504: {name: "Bainomugisha Colins", phoneNumber: "0781224511", address: "Mumbasa"},
    I4864998563046505: {name: "David Becham", phoneNumber: "0781224512", address: "Londan"},
    I4964998563046506: {name: "Ester Kabahinda", phoneNumber: "0781224513", address: "Bushenyi"},
    I5064998563046507: {name: "Flavia Kyomugisha", phoneNumber: "0781224514", address: "Gulu"},
    I5164998563046508: {name: "Gloria Nakandi", phoneNumber: "0781224515", address: "Kampala"},
    I5264998563046509: {name: "Henry Tigan", phoneNumber: "0781224516", address: "Jinja"},
    I5364998563046510: {name: "Thomas Becket", phoneNumber: "0781224517", address: "Mbale"},
  };
// { ${id_1}: {name: "...", phoneNumber: "0781224508", address: "..."}, 
                 //   ${id_2}): { name: "...", phoneNumber: "0781224508", address: "..." } 
                 // }
members.add = (membersObject) => {
    let newId = "UI"+(new Date().getUTCMilliseconds());
    membersObject.memberId = newId;
    members[newId] = membersObject;
    return newId;
};
members.readOne = ({memberId}) => {
    return members[memberId];
};

members.readAll = () => {
    let membersArr = [];
    for(key in members){
        if(!["add","readOne","readAll","update","remove"].includes(key)){
            membersArr.push({ id:key, ...members[key] });
        }
    }
    return membersArr;
};

members.update = ({ memberId, name, phoneNumber, address, updatedAt = new Date() } = {}) => {
    members[memberId] = {...members[memberId], 
                          ...(name && { name }),
                          ...(phoneNumber && { phoneNumber }),
                          ...(address && { address }),
                          updatedAt,
                        };
};
members.remove = ({memberId}) => {
    delete members[memberId];
};

//=========loans========

let loans = {};
loans.add = (loansObject) => {
    let newId = "LI"+(new Date().getUTCMilliseconds());
    loansObject.loanId = newId;
    loans[newId] = loansObject;
    return newId;
};
loans.readOne = ({loanId}) => {
    return loans[loanId];
};

loans.readAll = () => {
    let loansArr = [];
    for(key in loans){
        if(!["add","readOne","readAll","update","remove"].includes(key)){
            loansArr.push({ id:key, ...loans[key] });
        }
    }
    return loansArr;
};

loans.update = ({
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
       endDate,
       updatedAt = new Date(),
    } = {}) => {
    loans[loanId] = {...loans[loanId],
                      ...(memberId && { memberId }),
                      ...(principalAmount && { principalAmount }),
                      ...(loanInterestRate && { loanInterestRate }),
                      ...(interestRatedPer && { interestRatedPer }),
                      ...(instalmentsToBePer && { instalmentsToBePer }),
                      ...(loanToLastFor && { loanToLastFor }),
                      ...(loanToLastForDurationType && { loanToLastForDurationType }),
                      ...(EMIamount && { EMIamount }),
                      ...(loanStartDate && { loanStartDate }),
                      ...(loanStatus && { loanStatus }),
                      ...(endDate && { endDate }),
                      updatedAt,
                    };
};
loans.remove = ({loanId}) => {
    delete loans[loanId];
};

//============payments============

let payments = {};
payments.lastpayments = {};
payments.add = (paymentObject) => {
    let newId = "PI"+(new Date().getUTCMilliseconds());
    paymentObject.paymentId = newId;
    payments[newId] = paymentObject;
    const memberLastPaymentKey = paymentObject.loanId;
    payments.lastpayments[memberLastPaymentKey] = newId;
    return newId;
};
payments.readOne = ({paymentId}) => {
    return payments[paymentId];
};

payments.readAll = () => {
    let paymentsArr = [];
    for(key in payments){
        if(!["add","readOne","readAll","update","remove", "readLastByMember", "readAllByMember", "lastpayments"].includes(key)){
            paymentsArr.push({ id:key, ...payments[key] });
        }
    }
    return paymentsArr;
};

payments.readLastByLoanId = ({ loanId }) => {
    let loanLastPaymentKey = payments.lastpayments[loanId];
    return payments[loanLastPaymentKey];
};

payments.readAllByMember = ({memberId, loanId}) => {
    let allpayments = payments.readAll();
    let memberPayments = allpayments.filter(pymt => (pymt.memberId==memberId) && (pymt.loanId==loanId));
    return memberPayments;
};

payments.update = ({
        paymentId, 
        memberId, 
        loanId, 
        amountPaid, 
        interestPaid, 
        principalPaid, 
        outstandingBalance, 
        paymentDate,
        updatedAt = new Date(),
    } = {}) => {
    payments[paymentId] = {...payments[paymentId],
                            ...(memberId && { memberId }),
                            ...(loanId && { loanId }),
                            ...(amountPaid && { amountPaid }),
                            ...(interestPaid && { interestPaid }),
                            ...(principalPaid && { principalPaid }),
                            ...(outstandingBalance && { outstandingBalance }),
                            ...(paymentDate && { paymentDate }),
                            updatedAt,
                           };
};
payments.remove = ({paymentId}) => {
    delete payments[paymentId];
};

module.exports = { members, loans, payments };



