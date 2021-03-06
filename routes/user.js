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
// router.get('/:userId', User.readOne);

// // Update a user with UserId
// router.put('/:userId', User.update);

// // Delete a user with userId
// router.delete('/:userId', User.delete);

// view activity summary
//TODO: router.post('/viewactivity', User.viewUserActivity);

// request to join
router.post('/requesttojoin', User.requestToJoin);

// view all requests to join
//TODO: router.get('/viewrequeststojoin', User.viewRequestsToJoin);
// <hidden: request-id> <user-id> <firstname lastname> would like to join your 
// <institution/discoussion-group/class/alumni-group/> 
// <name-of-what-the-user-wants-to-join> as <what-the-user-wants-to-become-there>

// accept requests to join
//TODO: router.post('/acceptrequeststojoin', User.acceptRequestsToJoin);

// reject requests to join
//TODO: router.post('/rejectrequeststojoin', User.rejectRequestsToJoin);

module.exports = router;




