//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const trainerSchema = new Schema({
    trainerName: String,
    discipline: String,
    specialization: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    profilePicture: { type: String, required: false }, 
    cloudinaryId: { type: String }
});

trainerSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Trainer", trainerSchema);
