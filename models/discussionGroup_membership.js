const mongoose = require('mongoose'); 

const { Schema } = mongoose;
 
const discussionGroupMembershipSchema = new Schema({
    member:  { type: String } ,
    discussiongroup: { type: Schema.Types.ObjectId, ref: "DiscussionGroup" } //key
});

module.exports = mongoose.model("DiscussionGroupMembership", discussionGroupMembershipSchema);
