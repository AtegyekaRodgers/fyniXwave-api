//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const contentSchema = new Schema({
    contentName: String,
    parentCourse: { type: Schema.Types.ObjectId, ref: "Course" }
});

contentSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Content", contentSchema);
