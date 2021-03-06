const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('../models/user');
require('../models/requests_to_join');

const User = mongoose.model('User');
const JoinRequest = mongoose.model('JoinRequest');

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

User.requestToJoin = async (req, res) => {
  /*eg, req.body = 
    {
    "userId": "603f47b30659d72147b9506a",
    "fullName": "Rodgers Ategyeka",
    "whatToJoin": "discoussiongroup",
    "idOfWhatToJoin": "612f44b30659d72147b9503b",
    "nameOfWhatToJoin": "Discussion group two",
    "toJoinAs": "member",
    "canBeAcceptedBy": ["603f47b30659d72147b95062","413e47b30659d72147b95033"}]
    }
  */
  try {
    // saving the profile
    const joinRequest = new JoinRequest(req.body);
    await joinRequest.save();
    res.status(201).json({ message: 'You have successfully joined' });
  }catch (err) {
    res.status(500).json({message: err.message || 'An error occured while submitting your request to join'});
  }
};

module.exports = {
  User,
};



