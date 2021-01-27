const cloudinary = require('../config/cloudinary');
const Session = require('../models/session');

exports.setSession = async (req, res) => {
  try {
    // Upload session to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    // Generating an array of tags
    const tags = req.body.tags.split(',').map(String);
    // Create new session
    const session = new Session({
      userID: req.userID,
      sessionTitle: req.body.sessionTitle,
      sessionDate: req.body.sessionDate,
      presenter: req.body.presenter,
      cloudinaryFileLink: result.secure_url,
      cloudinaryId: result.public_id,
      description: req.body.description,
      tags,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    });
    // Save session
    await session.save();
    res.json(session);
  } catch (err) {
    console.log(err);
  }
};

// Get all sessionS
exports.getSessions = async (req, res) => {
  try {
    const session = await Session.find(
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
    res.json(session);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving sessions',
    });
    console.log(err);
  }
};

// Get individuals user sessions
exports.getMentorSessions = async (req, res) => {
  try {
    const session = await Session.find(
      { userID: req.userID },
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
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving sessions',
    });
    console.log(err);
  }
};

// retrieve single session
exports.singleSession = async (req, res) => {
  try {
    const session = await Session.findById(req.query.id);
    res.json(session);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving this session',
    });
    console.log(err);
  }
};

// delete session route
exports.deleteSession = async (req, res) => {
  try {
    // Find session by id
    const session = await Session.findById(req.query.id);
    if (session.userID !== req.userID) {
      res.status(403).json({
        message: 'Sessions can only be deleted by the owner',
      });
    }
    // Delete session from cloudinary
    await cloudinary.uploader.destroy(session.cloudinaryId);
    // Delete session from db
    await session.remove();
    res.json(session);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while deleting session',
    });
    console.log(err);
  }
};

exports.modifySession = async (req, res) => {
  try {
    let session = await Session.findById(req.query.id);
    if (session.userID !== req.userID) {
      res.status(403).json({
        message: 'Sessions can only be modified by the owner',
      });
    }
    // Delete session from cloudinary
    await cloudinary.uploader.destroy(session.cloudinaryId);
    // Upload session to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    const data = {
      sessionTitle: req.body.sessionTitle || session.sessionTitle,
      sessionDate: req.body.sessionDate || session.sessionDate,
      presenter: req.body.presenter || session.presenter,
      cloudinaryFileLink: result.secure_url || session.cloudinaryFileLink,
      cloudinaryId: result.public_id || session.cloudinaryId,
      description: req.body.description || session.description,
      startTime: req.body.startTime || session.startTime,
      endTime: req.body.endTime || session.endTime,
      modifiedAt: Date.now(),
    };
    session = await Session.findByIdAndUpdate(req.query.id, data, {
      new: true,
    });
    res.json(session);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || 'An error occured while updating session',
    });
  }
};

exports.searchSessionsByTags = async (tags) => {
  try {
    const contents = await Session.find(
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
    return contents;
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.getSimilarSessions = async (req, res) => {
  try {
    const { tags } = await Session.findById(req.params.sessionId, {
      tags: 1,
    });
    const similarSessions = await this.searchSessionsByTags(tags);
    res.status(200).json(similarSessions);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || 'Error getting related content',
    });
  }
};
