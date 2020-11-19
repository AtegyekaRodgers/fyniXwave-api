const mongoose = require('mongoose');
require('../models/user');

const User = mongoose.model('User');

User.create = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).send('Success');
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while creating new user',
    });
    console.log(err);
  }
};

User.readAll = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving users',
    });
    console.log(err);
  }
};

module.exports = {
  User,
};
