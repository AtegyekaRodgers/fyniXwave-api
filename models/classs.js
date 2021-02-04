//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const classsSchema = new Schema({
    classsName: String,
    parentCourse: { type: Schema.Types.ObjectId, ref: "Course" }
});

classsSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Classs", classsSchema);
