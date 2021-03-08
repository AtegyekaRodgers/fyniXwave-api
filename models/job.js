const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const jobSchema = new Schema({
    jobName: { type: Schema.Types.ObjectId, ref: "Institution" },
    discipline: { type: String },
    jobLink: { type: String },
    jobSummary: { type: String },
    profilePicture: { type: String },
    cloudinaryId: { type: String },
    datePosted: { type: Date },
    deadline: { type: Date },
    tags: [String]
});

jobSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Job", jobSchema);
