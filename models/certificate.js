const mongoose = require('mongoose');

const { Schema } = mongoose;
 
const certificateSchema = new Schema({
    title: { type: String },
    completed: [{ type: String }]
});
 
module.exports = mongoose.model("Certificate", certificateSchema);
