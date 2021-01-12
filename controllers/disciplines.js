const mongoose = require('mongoose');
require('../models/disciplines');

const Disciplines = mongoose.model('Disciplines');

Disciplines.create = async (req, res) => {
  try {
    // Saving discipline
    const discipline = new Disciplines(req.body);
    const saved = await discipline.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new discipline',
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
