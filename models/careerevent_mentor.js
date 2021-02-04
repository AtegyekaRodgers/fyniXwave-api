//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const careerEventMentorSchema = new Schema({
    careerEvent: { type: Schema.Types.ObjectId, ref: "CareerEvent"},
    mentor: { type: Schema.Types.ObjectId, ref: "Mentor"}
});

careerEventMentorSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("CareerEventMentor", careerEventMentorSchema);
