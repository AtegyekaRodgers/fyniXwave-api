//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const institutionLearnerSchema = new Schema({
    institution: { type: Schema.Types.ObjectId, ref: "Institution"},
    learner: { type: Schema.Types.ObjectId, ref: "Learner" }
});

institutionLearnerSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("InstitutionLearner", institutionLearnerSchema);
