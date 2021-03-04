//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const discussionGroupSchema = new Schema({
    groupName: String,
    member: { type: enum: [{ type: Schema.Types.ObjectId, ref: "Mentor"}, { type: Schema.Types.ObjectId, ref: "Trainer"}, { type: Schema.Types.ObjectId, ref: "Student"}, { type: Schema.Types.ObjectId, ref: "User"}] }    
});

discussionGroupSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("DiscussionGroup", discussionGroupSchema);
