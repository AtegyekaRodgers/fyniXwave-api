//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const courseContentSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "Course"},
    content: { type: Schema.Types.ObjectId, ref: "Content"}
});

courseContentSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("CourseContent", courseContentSchema);
