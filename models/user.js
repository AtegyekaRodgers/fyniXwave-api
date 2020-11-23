const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: {
    type: String,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phonenumber: {
    type: String,
    trim: true,
  },
  usercategory: {
    type: String,
    trim: true,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
