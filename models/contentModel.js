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
});


module.exports = mongoose.model('Content', contentSchema);
