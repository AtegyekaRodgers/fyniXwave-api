const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const learnerSchema = new Schema({
    fullName: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    discipline: { type: String },
    profilePicture: { type: String, required: false }, 
    cloudinaryId: { type: String },
    completed: [{ type: String }] //the list of courses a learner has completed. This will help us to award training certificates
});

learnerSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("Learner", learnerSchema);



