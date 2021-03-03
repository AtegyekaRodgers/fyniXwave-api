const mongoose = require('mongoose');

const InstitutionLocation = require('../models/inslocation');

// Creating a new InstitutionLocation profile
InstitutionLocation.create = async (req, res) => {
    /* req.body = 
    {
       "country": "Uganda",
       "city": "Kampala",
       "area": "Kawempe",
       "postalcode": "00000"
    }
    */
  try {
    // saving the profile
    const insLocation = new InstitutionLocation(req.body);
    await insLocation.save();
    res.status(201).json({ message: 'InstitutionLocation profile successfully created' });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while creating new institutionLocation profile',
    });
  }
};

// Retrieve all institution Locations
InstitutionLocation.readAll = async (req, res) => {
  try {
    const inslocations = await InstitutionLocation.find();
    res.status(200).json(inslocations);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'An error occured while retrieving institutions',
    });
  }
};


module.exports = { InstitutionLocation };



