const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const memberSchema = new Schema({
  //_id
  firstname: { type: String, trim: true, required: true, min: [2, 'first name too short'], max: [20, 'first name too long'] },
  lastname: { type: String, trim: true, min: [2, 'last name too short'], max: [25, 'last name too long'] } 
});
 
const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
