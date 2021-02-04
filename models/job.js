//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const jobSchema = new Schema({
    jobName: { type: Schema.Types.ObjectId, ref: "Institution" },
    field: String,
    jobLink: String,
    jobSummary: String,
    datePosted: Date,
    deadline: Date
});

jobSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Job", jobSchema);
