//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const classsSchema = new Schema({
    classsName: String,
    parentCourse: { type: Schema.Types.ObjectId, ref: "Course" , required: false},
    parentInstitution: {type: String, required: true}, //_id for the parent institution, default institution is Delv
    profilePicture: { type: String },
    cloudinaryId: { type: String }
});

classsSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Classs", classsSchema);
