const mongoose = require('mongoose');

const { Schema } = mongoose;

const contentSchema = new Schema({
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
  content: {
    type: String,
    trim: true,
  },
  
  rating: {
    type: String,
    trim: true,
  }
});

const Content = mongoose.model('Content', contentSchema);
module.exports = Content;
