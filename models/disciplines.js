const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const disciplinesSchema = new Schema({
  discipline: {
    type: String,
    trim: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  keywords: [
    {
      type: String,
      trim: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
  ],
});

disciplinesSchema.plugin(uniqueValidator);
const Disciplines = mongoose.model('Disciplines', disciplinesSchema);
module.exports = Disciplines;
