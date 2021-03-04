const mongoose = require('mongoose');

const Affiliation = require('../models/affiliation');

// Creating a new Affiliation relationship
Affiliation.create = async (relationship, cback) => { 
  try {
    // saving the relationship
    const affiliation = new Affiliation(relationship); 
    //eg. relationship = { institution: "5db6b26730f133b65dbbe459", affiliate: "23b65dbbe45db6b27530f13a", affiliateType: "trainer"} 
    let feedback = null;
    await affiliation.save((err,affiltn) => {
        if(err){ 
            console.log("await affiliation.save(...):  error = ", err);    
            feedback = {error: err.message || 'Failed to create new institution-trainer affiliation'};
            cback(feedback);
            return;
        } 
        console.log("await affiliation.save(...): success, affiltn = ", affiltn);
        feedback = {success: 'Institution-trainer affiliation successfully created'};
        cback(feedback); 
    }); 
  } catch (err) {
    console.log("Affiliation.create: .catch error ", err);
    let feedback = {error: err.message || 'An error occured while creating new institution-trainer affiliation'};
    cback(feedback);
  }
}; 

// Retrieve all Affiliation relationships
Affiliation.readAll = async () => {
  try {
    const data = await Affiliation.find().exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve all Affiliation relationships'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving Affiliation relationships '};
  }
};

// Retrieve one affiliation relationship
Affiliation.readOne = async (relationship) => {
  try {
    const data = await Affiliation.findOne()
    .where('affiliate').equals(relationship.affiliate)
    .where('institution').equals(relationship.institution)
    .exec(function(err, datta){
        if(err){ return  {error: err.message || 'Failed to retrieve affiliation'}; }
        return datta;
    });
    return {data: data};
  } catch (err) {
    return {error: err.message || 'An error occured while retrieving this affiliation'};
  }
};

module.exports = { Affiliation };



