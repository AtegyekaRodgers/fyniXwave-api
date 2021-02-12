//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const courseSchema = new Schema({
    courseName: String,
    courseCode: String,
    discipline: String, 
    specialization: String,
    profilePicture: { type: String, required: false },
    cloudinaryId: { type: String }
});

courseSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Course", courseSchema);
