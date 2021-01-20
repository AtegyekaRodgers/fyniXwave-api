// const mongoose = require('mongoose');
require('../models/user');

// const User = mongoose.model('User');
const index = () => true;

// When user not logged in
index.defaultFeed = (req, res) => {
  res.status(200).json({ message: 'Welcome to delv api' });
};

// Gets content and sessions for logged in user
index.userFeed = () => true;

module.exports = {
  index,
};
