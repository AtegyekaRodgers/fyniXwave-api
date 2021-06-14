const mongoose = require('mongoose');

const { Schema } = mongoose;
 
const paymentSchema = new Schema({
    //_id
    member_id: { type: Schema.Types.ObjectId, ref: "Member" },
    loan_id: { type: Schema.Types.ObjectId, ref: "Loan" },
    amountPaid: { type: Number },
    interestPaid: { type: Number },
    principalPaid: { type: Number },
    outstandingBalance: { type: Number },
    paymentDate: { type: Date }
});
 
module.exports = mongoose.model("Payment", paymentSchema);
