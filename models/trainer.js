//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const trainerSchema = new Schema({
    skillName: String,
    field: String,
    specialization: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" }
});

trainerSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Trainer", trainerSchema);
