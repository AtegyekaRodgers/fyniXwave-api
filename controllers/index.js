const Content = require('../models/contentModel');
const Session = require('../models/session');

const index = () => true;

// When user not logged in
index.feed = async (req, res) => {
  try {
    const content = await Content.find(
      {},
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
      {},
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
    res.status(200).json({ message: 'Welcome to delv api', content, sessions });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while searching',
    });
  }
};

// Gets content and sessions for user not logged in
index.search = async (req, res) => {
  try {
    const content = await Content.find(
      {},
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
      {},
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
    res.json({ content, sessions });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while searching',
    });
  }
};

module.exports = {
  index,
};
