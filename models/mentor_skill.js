//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const mentorSkillSchema = new Schema({
    mentor: { type: Schema.Types.ObjectId, ref: "Mentor"},
    skill: { type: Schema.Types.ObjectId, ref: "Skill"}
});

mentorSkillSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("MentorSkill", mentorSkillSchema);
