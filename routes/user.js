const express = require('express');
const { User } = require('../controllers/user.js');

const router = express.Router();

// Create a new user
router.post('/', User.create);

// Retrieve all Customers
router.get('/', User.readAll);

// // Retrieve a single user with userId
// router.get('/:userId', user.readOne);

// // Update a user with UserId
// router.put('/:userId', user.update);

// // Delete a user with userId
// router.delete('/:userId', user.delete);

module.exports = router;
