const mongoose = require('mongoose'); 

const { Schema } = mongoose;

const certificateAwardSchema = new Schema({
    certificate: { type: Schema.Types.ObjectId, ref: "Course"},
    institution: { type: Schema.Types.ObjectId, ref: "Institution"},
    learner: { type: Schema.Types.ObjectId, ref: "User"}
});
 
module.exports = mongoose.model("CertificateAward", certificateAwardSchema);
