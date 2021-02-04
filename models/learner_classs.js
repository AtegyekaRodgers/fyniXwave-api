//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const learnerClasssSchema = new Schema({
    learner: { type: Schema.Types.ObjectId, ref: "Learner"},
    classs: { type: Schema.Types.ObjectId, ref: "Classs"}
});

learnerClasssSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("LearnerClasss", learnerClasssSchema);
