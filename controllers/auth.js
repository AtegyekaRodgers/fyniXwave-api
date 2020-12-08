const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const secret = require('../config/jwt');
require('../models/user');

const User = mongoose.model('User');

const auth = () => true;

auth.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const authenticate = await bcrypt.compare(
        req.body.password,
        user.password,
      );
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
    }
    if (!user) {
      res.status(500).json({
        err: 'User account not found',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Login failed',
    });
  }
};

auth.logout = async (req, res) => {
  res.status(200).json({
    user: null,
    token: null,
    message: 'log out successful',
  });
};

auth.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const authenticate = await bcrypt.compare(
        req.body.password,
        user.password,
      );
      if (authenticate) {
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.newPassword, salt);
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              password: newPassword,
            },
          },
        );
        res.status(200).json({
          user: null,
          token: null,
          message: 'Password has been reset. Please log in',
        });
      } else {
        res.status(400).json({
          err: 'Password incorrect',
        });
      }
    } else {
      res.status(400).json({
        err: 'User account not found',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Reset password failed',
    });
  }
};

auth.authorize = async (req, res, next) => {
  const header = req.headers.authorization;

  if (typeof header !== 'undefined') {
    const bearer = header.split(' ');
    const token = bearer[1];
    req.token = token;

    try {
      const tokenValid = await jwt.verify(token, `${secret}`);
      if (!tokenValid) {
        res.status(401).json({
          user: null,
          message: 'Authentication failed',
        });
      }
      next();
    } catch (err) {
      res.status(500).json({
        err: err.message || 'Server Error',
      });
    }
  } else {
    // If header is undefined gives status Forbidden
    res.status(403).json({
      err: 'Forbidden. Please login',
    });
  }
};

module.exports = {
  auth,
};
