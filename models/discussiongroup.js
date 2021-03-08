//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const discussionGroupSchema = new Schema({
    groupName: String,
    admins: [{type: Schema.Types.ObjectId, ref: "User"}],
    members: [{type: Schema.Types.ObjectId, ref: "User"}],
    profilePicture: { type: String, required: false },
    cloudinaryId: { type: String }
});

discussionGroupSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("DiscussionGroup", discussionGroupSchema);
