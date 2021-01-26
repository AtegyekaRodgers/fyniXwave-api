const mongoose = require('mongoose');
const Content = require('../models/contentModel');
const Session = require('../models/session');
require('../models/disciplines');
require('../models/user');

const User = mongoose.model('User');
const Disciplines = mongoose.model('Disciplines');

const home = () => true;

// Maps user interests into tags
const interestsToTags = async (interestsToMap) => {
  try {
    const interestsArray = await Disciplines.find(
      {
        $and: [{ discipline: { $in: interestsToMap } }],
      },
      { keywords: 1 },
    );
    const tags = [];
    for (let index = 0; index < interestsArray.length; index += 1) {
      tags.push(...interestsArray[index].keywords);
    }
    return tags;
  } catch (err) {
    return {
      message:
        err.message
        || 'An error occured while searching users tags of interest',
    };
  }
};

// Gets user's interests as an array
const userInterests = async (userID) => {
  try {
    const interestsArray = await User.findById(userID, { interests: 1 });
    return interestsArray;
  } catch (err) {
    return {
      message: err.message || 'An error occured while getting users interests',
    };
  }
};

// When user logged in
home.feed = async (req, res) => {
  const { interests } = await userInterests(req.userID);
  const tags = await interestsToTags(interests);
  try {
    const content = await Content.find(
      {
        $and: [{ tags: { $in: tags } }],
      },
      {
        title: 1,
        author: 1,
        description: 1,
        category: 1,
        cloudinaryFileLink: 1,
        cloudinaryId: 1,
        createdAt: 1,
        modifiedAt: 1,
      },
    ).sort({ createdAt: -1 });
    const sessions = await Session.find(
      {
        $and: [{ tags: { $in: tags } }],
      },
      {
        sessionTitle: 1,
        sessionDate: 1,
        presenter: 1,
        cloudinaryFileLink: 1,
        cloudinaryId: 1,
        description: 1,
        startTime: 1,
        endTime: 1,
      },
    ).sort({ startDate: -1 });
    res.status(200).json({ sessions, content });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while searching',
    });
  }
};

module.exports = {
  home,
};
