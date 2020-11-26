const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: [true, 'email is required'],
    unique: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  phonenumber: {
    type: String,
    trim: true,
    unique: true,
    validate: {
      validator(v) {
        // Format is 256-774-123456
        return /\d{3}-\d{3}-\d{6}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  firstname: {
    type: String,
    trim: true,
    required: true,
    min: [2, 'first name too short'],
    max: 20,
  },
  lastname: {
    type: String,
    trim: true,
    min: [2, 'last name too short'],
    max: 25,
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
    enum: ['institution', 'mentor', 'student'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
