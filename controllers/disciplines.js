const mongoose = require('mongoose');
require('../models/disciplines');

const Disciplines = mongoose.model('Disciplines');

Disciplines.create = async (req, res) => {
  try {
    // Creating discipline
    const discipline = new Disciplines({
      discipline: req.body.discipline,
      keywords: req.body.discipline,
    });
    const created = await discipline.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new discipline',
    });
  }
};

Disciplines.addTags = async (req, res) => {
  try {
    const tags = req.body.tags.split(',').map(String);
    await Disciplines.findByIdAndUpdate(
      req.query.id,
      {
        $addToSet: {
          keywords: {
            $each: tags,
          },
        },
      },
      { useFindAndModify: false },
    );
    res.status(204).json({
      message: 'tags added successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while adding interests',
    });
  }
};

Disciplines.read = async (req, res) => {
  try {
    const disciplines = await Disciplines.find();
    res.status(200).json(disciplines);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving disciplines',
    });
  }
};

Disciplines.readOne = async (req, res) => {
  try {
    const { id } = req.params;
    const discipline = await Disciplines.findById(id);
    res.status(200).json(discipline);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving discipline',
    });
  }
};

module.exports = {
  Disciplines,
};
