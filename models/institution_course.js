//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const institutionCourseSchema = new Schema({
    institution: { type: Schema.Types.ObjectId, ref: "Institution"},
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    courseCode: { type: String }
});

institutionCourseSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("InstitutionCourse", institutionCourseSchema);
