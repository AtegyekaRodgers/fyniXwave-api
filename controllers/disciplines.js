const mongoose = require('mongoose');
require('../models/disciplines');

const Disciplines = mongoose.model('Disciplines');

Disciplines.create = async (req, res) => {
  console.log("disciplines: create request");
  try {
    // Generating an array of tags
    const keywords = req.body.keywords.split(',').map(String);
    keywords.push(req.body.discipline);
    // Creating discipline
    const discipline = new Disciplines({
      discipline: req.body.discipline,
      keywords,
    });
    const created = await discipline.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new discipline',
    });
  }
};

Disciplines.addKeywords = async (req, res) => {
  try {
    const keywords = req.body.keywords.split(',').map(String);
    await Disciplines.findByIdAndUpdate(
      req.query.id,
      {
        $addToSet: {
          keywords: {
            $each: keywords,
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
  console.log("disciplines: read request");
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
