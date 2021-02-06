const express = require('express');
const { Trainer } = require('../controllers/trainer');
const { auth } = require('../controllers/auth');

const router = express.Router();

// Create a new trainer
router.post('/', Trainer.create);

// Retrieve all trainers
router.get('/', auth.authorize, Trainer.readAll);
 
// // Retrieve a single trainer with this id
router.get('/:id', Trainer.readOne);

// // Update a trainer with id
// router.put('/:id', Trainer.update);

// // Delete a trainer with id
// router.delete('/:id', Trainer.delete);

module.exports = router;
