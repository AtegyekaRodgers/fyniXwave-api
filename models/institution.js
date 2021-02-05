const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const institutionSchema = new Schema({
  institutionName: { type: String, unique: true, uniqueCaseInsensitive: true},
  location: { type: Schema.Types.ObjectId, ref: "InsLocation" },
  alumniGroup: { type: Schema.Types.ObjectId, ref: "AlumniGroup" },
  profilePicture: { type: String, required: false }
});

institutionSchema.plugin(uniqueValidator);
const Institution = mongoose.model('Institution', institutionSchema);
module.exports = Institution;
