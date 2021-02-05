//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const skillSchema = new Schema({
    skillName: {type: String, trim: true, required: [true, 'skillName is required']},
    discipline: {type: String, trim: true},
    specialization: String,
    profilePicture: { type: String, required: false }
});

skillSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Skill", skillSchema);
