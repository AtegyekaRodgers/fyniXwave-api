//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const courseSkillSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "Course"},
    skill: { type: Schema.Types.ObjectId, ref: "Skill" }
});

courseSkillSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("CourseSkill", courseSkillSchema);
