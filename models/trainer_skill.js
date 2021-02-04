//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const trainerSkillSchema = new Schema({
    trainer: { type: Schema.Types.ObjectId, ref: "Trainer"},
    skill: { type: Schema.Types.ObjectId, ref: "Skill"}
});

trainerSkillSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("TrainerSkill", trainerSkillSchema);
