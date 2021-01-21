const mongoose = require('mongoose');
const Content = require('../models/contentModel');
const Session = require('../models/session');
require('../models/disciplines');

const Disciplines = mongoose.model('Disciplines');

const home = () => true;

// Gets user tags based on user interests
const interestsToTags = async (interests) => {
  try {
    const interestsArray = await Disciplines.find(
      {
        $and: [{ discipline: { $in: interests } }],
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
        err.message || 'An error occured while searching users interests',
    };
  }
};

// When user not logged in
home.feed = async (req, res) => {
  const tags = await interestsToTags(req.body.interests);
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
        tags: 1,
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
