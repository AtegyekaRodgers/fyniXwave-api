const mongoose = require('mongoose');

const CertificateAward = require('../models/certificate_award');

CertificateAward.create = async (relationship) => {
  try {
    const certificateAward = new CertificateAward(relationship); 
    //eg. relationship = { certificate: "5db6b26730f133b65dbbe459", institution: "23b65dbbe45db6b27530f13a", learner: "a2b44dbe45db6b27530f21e"} 
    await certificateAward.save();
    return { success: 'CertificateAward successfully created' };
  } catch (err) {
    return {error: err.message || 'An error occured while creating new cerficate award'};
  }
}; 

// Retrieve all cerficate_awards
CertificateAward.readAll = async () => {
  try {
    const data = await CertificateAward.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to read cerficate_awards'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while reading cerficate_awards '};
  }
};

// Retrieve one cerficate_award
CertificateAward.readOne = async (relationship) => {
  try {
    const data = await CertificateAward.findOne({certificate:relationship.certificate, institution:relationship.institution, learner:relationship.learner})
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve a cerficate_award'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this cerficate_award'};
  }
};

module.exports = { CertificateAward };



