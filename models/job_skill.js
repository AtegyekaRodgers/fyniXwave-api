//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const jobSkillSchema = new Schema({
    job: { type: Schema.Types.ObjectId, ref: "Job"},
    skill: { type: Schema.Types.ObjectId, ref: "Skill"}
});

jobSkillSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("JobSkill", jobSkillSchema);
