//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const discussionMeetingSchema = new Schema({
    disMeetingName: String,
    remote: Boolean,
    venue: String,
    theme: String,
    sponsoredBy: [String],
    startDate: Date,
    startTime: String,
    duration: String,
    parentGroup: {type: Schema.Types.ObjectId, ref: "DiscussionGroup"},
    meetingLink: String  //eg, zoom meeting link
});

discussionMeetingSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("DiscussionMeeting", discussionMeetingSchema);
