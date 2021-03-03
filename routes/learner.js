
const express = require('express');
const { Learner } = require('../controllers/learner');
const { auth } = require('../controllers/auth');

const router = express.Router();

//Add or replace a profile picture
router.post('/profilepic', Learner.create);

// Create a new learner
router.post('/', Learner.create);

// Retrieve all learners
router.get('/', Learner.readAll);
 
// // Retrieve a single learner with this id
router.get('/:id', Learner.readOne);

// // Update a learner with id
// router.put('/:id', Learner.update);

// // Delete a learner with id
// router.delete('/:id', Learner.delete);

module.exports = router;


