const mongoose = require('mongoose');

const { Schema } = mongoose;
 
const activitySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    activityLog: { type: String },
    logDate: { type: Date },
    logTime: { type: String }
});
 
module.exports = mongoose.model("Activity", activitySchema);
