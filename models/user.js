const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  email: String,
  phonenumber: String,
  usercategory: String,
});

const User = mongoose.model('user', userSchema);
module.exports = User;
