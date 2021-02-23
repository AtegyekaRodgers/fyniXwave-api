const mongoose = require('mongoose');

const Activity = require('../models/activity');

// Creating a new activity log
Activity.create = async (activityLog) => {
  try {
    const activityLogg = new Activity(activityLog);
    await activityLogg.save();
    return { success: 'Activity log successfully saved' };
  } catch (err) {
    return {error: err.message || 'An error occured while saving a new activity Log'};
  }
};

// Retrieve all activityLogs for a specific user
Activity.readAll = async (req, res) => {
  try {
    const activities = await Activity.find()
    .where('user').equals(req.body.user_id);
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).send({error: err.message || 'An error occured while retrieving activityLogs '});
  }
};


module.exports = { Activity };



