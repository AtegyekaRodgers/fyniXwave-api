//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const courseClasssSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "Course"},
    classs: { type: Schema.Types.ObjectId, ref: "Classs"}
});

courseClasssSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("CourseClasss", courseClasssSchema);
