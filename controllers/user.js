const mongoose = require('mongoose');
require('../models/user');

const User = mongoose.model('User');

User.create = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ message: 'success' });
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
