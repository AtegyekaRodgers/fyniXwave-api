const mongoose = require('mongoose');

const Certificate = require('../models/certificate');

// Creating a new certificate log
Certificate.create = async (req, res) => {
    /* req.body = 
        {
            title: "...",
            courses: ["...", "...", "..."]
        }
    */ 
  try {
    let certificateData = {
            title:     req.body.title,
            courses:   req.body.courses
        }
    const certificate = new Certificate(certificateData);
    await certificate.save();
    res.status(200).send({ success: 'Certificate details successfully saved' });
  } catch (err) {
    res.status(500).send({error: err.message || 'An error occured while saving the new certificate details'});
  }
};

// Retrieve all certificates
Certificate.readAll = async (req, res) => {
  try {
    const certificates = await Certificate.find()
    res.status(200).json(certificates);
  } catch (err) {
    res.status(500).send({error: err.message || 'An error occured while retrieving certificates '});
  }
};


module.exports = { Certificate };



