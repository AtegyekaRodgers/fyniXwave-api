//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const courseLearnerSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    learner: { type: Schema.Types.ObjectId, ref: "Learner" }
});

//to turn the schema into a model, then export that model
module.exports = mongoose.model("CourseLearner", courseLearnerSchema);
