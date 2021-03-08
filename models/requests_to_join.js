const mongoose = require('mongoose');

const { Schema } = mongoose;

const joinRequestSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},  //user who wants to join
    fullName: {type: String},
    whatToJoin: { type: String, enum: ["institution","discoussiongroup","classs","alumnigroup"]},
    idOfWhatToJoin: {type: String},
    nameOfWhatToJoin: {type: String},
    toJoinAs: { type: String}, //student, staff, member, etc
    staffId: {type: String}, //if applicable: optional and applies if 'toJoinAs' = 'staff'
    title: {type: String}, //if applicable: optional and applies if 'toJoinAs' = 'staff',
    discipline: {type: String}, //optional
    canBeAcceptedBy: [{type: Schema.Types.ObjectId, ref: "User"}], //admins
    status: {type: String, enum: ["pending", "accepted", "rejected"], default: "pending"},
    whyRejected: {type: String, default:"No reason given for rejection"} //applies only when join request is rejected
});

module.exports = mongoose.model("JoinRequest", joinRequestSchema);
