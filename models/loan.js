const mongoose = require('mongoose');

const { Schema } = mongoose;
 
const loanSchema = new Schema({
    //_id
    member_id: { type: Schema.Types.ObjectId, ref: "Member" },
    principalAmount: { type: Number },
    EMIamount: { type: Number },
    dateStarted: { type: Date, default: Date.now() },
    loanStatus: { type: String, enum: ["ongoing","cleared","bad_debt"], default: "ongoing" },
    endDate: { type: Date }
});
 
module.exports = mongoose.model("Loan", loanSchema);
