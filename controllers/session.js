const cloudinary = require('../config/cloudinary');
const Session = require('../models/session');

exports.setSession = async (req, res) => {
  try {
    // Upload session to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    // Create new session
    const session = new Session({
      sessionTitle: req.body.sessionTitle,
      sessionDate: req.body.sessionDate,
      presenter: req.body.presenter,
      cloudinaryFileLink: result.secure_url,
      cloudinaryId: result.public_id,
      description: req.body.description,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      modifiedAt: Date.now(),
    });
    // Save session
    await session.save();
    res.json(session);
  } catch (err) {
    console.log(err);
  }
};

// session get route
exports.getSession = async (req, res) => {
  try {
    let session = await Session.find({},{"sessionTitle":1, "sessionDate":1, "presenter":1, "cloudinaryId":1, "description":1, "startTime":1, "endTime":1}).sort({"startDate": -1});
    res.json(session);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occured while retrieving sessions',
    });
    console.log(err);
  }
};


