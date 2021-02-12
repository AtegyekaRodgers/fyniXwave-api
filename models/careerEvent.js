//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const careerEventSchema = new Schema({
    eventName: String,
    fieldOfFocus: String,
    remote: Boolean,
    venue: String,
    theme: String,
    sponsoredBy: [String],
    profilePicture: { type: String },
    cloudinaryId: { type: String },
    startDate: Date,
    endDate: Date
});

careerEventSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("CareerEvent", careerEventSchema);
