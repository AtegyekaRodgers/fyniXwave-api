//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const learnerSkillSchema = new Schema({
    learner: { type: Schema.Types.ObjectId, ref: "Learner"},
    skill: { type: Schema.Types.ObjectId, ref: "Skill"}
});

learnerSkillSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("LearnerSkill", learnerSkillSchema);
