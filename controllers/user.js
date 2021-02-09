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
    
    req.body.usercategory = [req.body.usercategory];
    // Saving user 
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'user successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new user',
    });
  }
};

User.readAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving users',
    });
  }
};

User.addInterests = async (req, res) => {
  try {
    const interests = req.body.interests.split(',').map(String);
    const updated = await User.findByIdAndUpdate(
      req.query.id,
      {
        $addToSet: {
          interests: {
            $each: interests,
          },
        },
      },
      { useFindAndModify: false },
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while adding interests',
    });
  }
};

module.exports = {
  User,
};



