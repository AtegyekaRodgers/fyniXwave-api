//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const courseSchema = new Schema({
    courseName: { type: String },
    discipline: { type: String },
    specialization: { type: String },
    tags:  [String],
    profilePicture: { type: String, required: false },
    cloudinaryId: { type: String },
    accessibility: { type: String, enum: ["open", "paid"], default: "open" }
});

courseSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Course", courseSchema);
