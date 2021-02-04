//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const institutionCareerEventSchema = new Schema({
    institution: { type: Schema.Types.ObjectId, ref: "Institution"},
    careerEvent: { type: Schema.Types.ObjectId, ref: "CareerEvent" }
});

institutionCareerEventSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("InstitutionCareerEvent", institutionCareerEventSchema);
