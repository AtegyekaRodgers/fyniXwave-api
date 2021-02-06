//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const careerEventSkillSchema = new Schema({
    careerEvent: { type: Schema.Types.ObjectId, ref: "CareerEvent"},
    skill: { type: Schema.Types.ObjectId, ref: "Skill"}
});

careerEventSkillSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("CareerEventSkill", careerEventSkillSchema);