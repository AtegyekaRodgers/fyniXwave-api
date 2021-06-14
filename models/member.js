const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const memberSchema = new Schema({
  //_id
  name: { type: String },
});
 
const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
