const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const disciplinesSchema = new Schema({
  discipline: {
    type: String,
    trim: true,
    required: [true, 'discipline name is required'],
    unique: true,
    uniqueCaseInsensitive: true,
  },
  keywords: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

disciplinesSchema.plugin(uniqueValidator);
const Disciplines = mongoose.model('Disciplines', disciplinesSchema);
module.exports = Disciplines;
