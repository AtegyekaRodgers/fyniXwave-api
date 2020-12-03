const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const secret = require('../config/jwt');
require('../models/user');

const User = mongoose.model('User');

const auth = () => true;

auth.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const authenticate = await bcrypt.compare(req.body.password, user.password);
      if (authenticate) {
        const token = jwt.sign({ id: user._id }, `${secret}`, {
        // Token will expire in one month
          expiresIn: 86400 * 30,
        });
        res.status(200).json({
          token,
          user,
        });
      } else {
        res.status(400).json({
          err: 'Username or Password incorrect',
        });
      }
    } else {
      res.status(400).json({
        err: 'User account not found',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Login failed',
    });
  }
};

auth.logout = () => {};

auth.resetPassword = () => {};

module.exports = {
  auth,
};
