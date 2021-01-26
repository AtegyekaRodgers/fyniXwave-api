const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema(
  {
    userID: {
      type: String,
      trim: true,
      required: true,
    },
    sessionTitle: {
      type: String,
      trim: true,
    },
    sessionDate: {
      type: String,
      trim: true,
    },
    presenter: {
      type: String,
      trim: true,
    },
    cloudinaryFileLink: {
      type: String,
    },
    cloudinaryId: {
      type: String,
    },
    description: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    modifiedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Session', sessionSchema);