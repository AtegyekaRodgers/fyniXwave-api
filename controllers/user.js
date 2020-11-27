const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('../models/user');

const User = mongoose.model('User');

User.create = async (req, res) => {
  try {
    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // Saving user
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'user successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new user',
    });
    console.error(err);
  }
};

User.readAll = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving users',
    });
    console.error(err);
  }
};

module.exports = {
  User,
};
