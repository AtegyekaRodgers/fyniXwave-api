
const express = require('express');
const { Classs } = require('../controllers/classs');
const { auth } = require('../controllers/auth');

const router = express.Router();

//Add or replace a profile picture
router.post('/profilepic', Classs.create); 

// Create a new classs
router.post('/', Classs.create);

// Retrieve all classses
router.get('/', Classs.readAll);
 
// // Retrieve a single classs with this id
router.get('/:id', Classs.readOne);

// Open this class
router.post('/open', Classs.open);

// Attend this a session in an open class
router.post('/attend', Classs.attend);

// end a classs before predefined endDate
router.put('/end', Classs.end);


// Update a classs with id
// router.put('/:id', Classs.update);

// // Delete a classs with id
// router.delete('/:id', Classs.delete);

module.exports = router;


