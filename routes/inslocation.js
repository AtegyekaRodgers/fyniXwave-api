const express = require('express');
const { InstitutionLocation } = require('../controllers/inslocation');
const { auth } = require('../controllers/auth');

const router = express.Router();

// Create a new InstitutionLocation
router.post('/', InstitutionLocation.create);

// Retrieve all InstitutionLocations
router.get('/', InstitutionLocation.readAll);
  

// // Update a InstitutionLocation with id
// router.put('/:id', InstitutionLocation.update);

// // Delete a InstitutionLocation with id
// router.delete('/:id', InstitutionLocation.delete);

module.exports = router;
