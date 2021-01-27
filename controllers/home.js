const mongoose = require('mongoose');
const { searchContentByTags } = require('./contentController');
const Session = require('../models/session');
require('../models/disciplines');
require('../models/user');

const User = mongoose.model('User');
const Disciplines = mongoose.model('Disciplines');

const home = () => true;

// This gets disciplines followed by the user and respective keywords
const followedDisciplines = async (userID) => {
  try {
    const { interests } = await User.findById(userID, { interests: 1 });
    const userDisciplines = await Disciplines.find({
      $and: [{ discipline: { $in: interests } }],
    });
    return userDisciplines;
  } catch (err) {
    return {
      message:
        err.message
        || 'An error occured while getting user followed disciplines',
    };
  }
};

home.feed = async (req, res) => {
  const disciplinesArray = await followedDisciplines(req.userID);
  const tags = [];
  for (let index = 0; index < disciplinesArray.length; index += 1) {
    tags.push(...disciplinesArray[index].keywords);
  }
  try {
    const content = await searchContentByTags(tags);
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
    res.status(200).json({ content, sessions });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while searching',
    });
  }
};

module.exports = {
  home,
};
