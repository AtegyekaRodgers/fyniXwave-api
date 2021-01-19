const express = require('express');
const { User } = require('../controllers/user');
const { auth } = require('../controllers/auth');

const router = express.Router();

// Create a new user
router.post('/', User.create);

// Retrieve all Customers
router.get('/', auth.authorize, User.readAll);

// Add user interests
router.put('/interests', auth.authorize, User.addInterests);

// // Retrieve a single user with userId
// router.get('/:userId', user.readOne);

// // Update a user with UserId
// router.put('/:userId', user.update);

// // Delete a user with userId
// router.delete('/:userId', user.delete);

module.exports = router;
