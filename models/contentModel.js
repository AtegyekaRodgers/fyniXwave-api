const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  rating: {
    type: String,
    trim: true,
  },
  cloudinaryFileLink: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  modifiedAt: {
    type: Date,
    default: Date.now(),
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Content', contentSchema);
