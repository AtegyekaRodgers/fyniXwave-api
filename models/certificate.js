const mongoose = require('mongoose');

const { Schema } = mongoose;
 
const certificateSchema = new Schema({
    title: { type: String },
    courses: [{ type: String }]
});
 
module.exports = mongoose.model("Certificate", certificateSchema);
