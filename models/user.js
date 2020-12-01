const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: [true, 'email is required'],
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
    unique: true,
  },
  phonenumber: {
    type: String,
    trim: true,
    required: [true, 'phone number is required'],
    validate: {
      validator(v) {
        // Format is 256-774-123456
        return /\d{3}-\d{3}-\d{6}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    unique: true,
  },
  firstname: {
    type: String,
    trim: true,
    required: true,
    min: [2, 'first name too short'],
    max: [20, 'first name too long'],
  },
  lastname: {
    type: String,
    trim: true,
    min: [2, 'last name too short'],
    max: [25, 'last name too long'],
  },
  username: {
    type: String,
    trim: true,
    required: true,
    min: [2, 'username too short'],
    max: [15, 'username too long'],
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'password is required'],
  },
  usercategory: {
    type: String,
    trim: true,
    required: [true, 'user category is required'],
    enum: ['institution', 'mentor', 'student', 'employee', 'graduate'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
