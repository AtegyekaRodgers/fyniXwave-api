
//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const learnerSchema = new Schema({
    fullName: String,
    studentNo: { type: String, required: true, unique: true },
    regNo: { type: String, required: true },
    emailAddress: [String],
    gender: { type: String, enum: ["male", "female"] },
    address: String,
    nationality: String,
    admissionDate: Date,
    fieldOfStudy: String,
    levelOfEducation: String,
    gradStatus: { type: String, enum: ["current", "completed", "returned", "retained"] }
    userId: { type: Schema.Types.ObjectId, ref: "User" }
    discipline: { type: Schema.Types.ObjectId, ref: "Disciplines" }
    profilePicture: { type: String, required: false }
});

learnerSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Learner", learnerSchema);



