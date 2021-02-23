const mongoose = require('mongoose');

const { Schema } = mongoose;
 
const paymentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    paidFor: { type: String },
    item: { type: String },  //item_id
    amountPaid: { type: Number }
});
 
module.exports = mongoose.model("Payment", paymentSchema);
