//to grab the things needed
const mongoose = require('mongoose');

const { Schema } = mongoose;

//to create a schema
const courseLearnerSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    learner: { type: Schema.Types.ObjectId, ref: "Learner" },
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    amountPaid: { type: Number, default:0 },
    currency: { type: String }
});

//to turn the schema into a model, then export that model
module.exports = mongoose.model("CourseLearner", courseLearnerSchema);
