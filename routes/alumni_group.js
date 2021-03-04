const express = require('express');
const { Alumni } = require('../controllers/alumnigroup');
const { auth } = require('../controllers/auth');

const router = express.Router();

//Add or replace a profile picture
router.post('/profilepic', Alumni.updateProfilePicture);

// Create a new alumni group
router.post('/', Alumni.create);

// Retrieve all Alumnis
router.get('/', Alumni.readAll);
 
// // Retrieve a single alumni group with this id
router.get('/:id', Alumni.readOne);

// // Update a alumni group with id
// router.put('/:id', Alumni.update);

// // Delete a alumni group with id
// router.delete('/:id', Alumni.delete);

module.exports = router;
