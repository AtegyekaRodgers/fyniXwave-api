//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const affiliationSchema = new Schema({
    institution: { type: Schema.Types.ObjectId, ref: "Institution" },
    affiliateType: { type: String, enum: ["mentor", "trainer"]},
    affiliate: { type: String, enum: [{ type: Schema.Types.ObjectId, ref: "Mentor" }, { type: Schema.Types.ObjectId, ref: "Trainer" }] }     
});

affiliationSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Affiliation", affiliationSchema);
