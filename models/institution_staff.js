const mongoose = require('mongoose');

const { Schema } = mongoose;

const institutionStaffSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    institution: {type: Schema.Types.ObjectId, ref: "Institution"},
    staffId: {type: String},  //optional
    fullName: {type: String},
    title: { type: String},
    roles: {type: Number, default: 0 }   //bitwise encoded roles
});

module.exports = mongoose.model("InstitutionStaff", institutionStaffSchema);
