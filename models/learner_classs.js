const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//create a schema
const learnerClasssSchema = new Schema({
    learner: { type: Schema.Types.ObjectId, ref: "Learner"},
    classs: { type: Schema.Types.ObjectId, ref: "Classs"}
});

learnerClasssSchema.plugin(uniqueValidator);
//turn the schema into a model, then export that model
module.exports = mongoose.model("LearnerClasss", learnerClasssSchema);
