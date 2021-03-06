const mongoose = require('mongoose');

const { Schema } = mongoose;

const joinRequestSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},  //user who wants to join
    fullName: {type: String},
    whatToJoin: { type: String, enum: ["institution","discoussiongroup","classs","alumnigroup"]},
    idOfWhatToJoin: {type: String},
    nameOfWhatToJoin: {type: String},
    toJoinAs: { type: String}, //student, staff, member, etc
    canBeAcceptedBy: [{type: Schema.Types.ObjectId, ref: "User"}], //admins
    status: {type: String, enum: ["pending", "accepted", "rejected"], default: "pending"}
});

module.exports = mongoose.model("JoinRequest", joinRequestSchema);
