//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const insLocationSchema = new Schema({
    country: String,
    city: String,
    area: String,
    postalcode: String
});

insLocationSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("InsLocation", insLocationSchema);
