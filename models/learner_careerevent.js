//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const learnerCareerEventSchema = new Schema({
    learner: { type: Schema.Types.ObjectId, ref: "Learner"},
    careerEvent: { type: Schema.Types.ObjectId, ref: "CareerEvent"}
});

learnerCareerEventSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("LearnerCareerEvent", learnerCareerEventSchema);
