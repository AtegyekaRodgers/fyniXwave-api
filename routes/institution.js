const express = require('express');
const { Institution } = require('../controllers/institution');
const { auth } = require('../controllers/auth');

const router = express.Router();

//Add or replace a profile picture
router.post('/profilepic', Institution.updateProfilePicture);

// Create a new institution
router.post('/', Institution.create);

// Retrieve all Institutions
router.get('/', Institution.readAll);
 
// Retrieve a single institution with this id
router.get('/:id', Institution.readOne);

// Update a institution with id
// router.put('/:id', Institution.update);

// Delete a institution with id
// router.delete('/:id', Institution.delete);

// register staff
//TODO: router.post('/registerstaff', Institution.registerStaff);

// register student
//TODO: router.post('/registerstudent', Institution.registerStudent);

module.exports = router;





