//to grab the things needed
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

//to create a schema
const alumniGroupSchema = new Schema({
    groupName: { type: String },
    started: { type: Date },
    parentInstitution: { type: Schema.Types.ObjectId, ref: "Institution" },
    admins: [{type: Schema.Types.ObjectId, ref: "User"}],
    profilePicture: { type: String },
    cloudinaryId: { type: String }
});

alumniGroupSchema.plugin(uniqueValidator);
//to turn the schema into a model, then export that model
module.exports = mongoose.model("AlumniGroup", alumniGroupSchema);
