const express = require('express');
const { DiscussionGroup } = require('../controllers/discussiongroup');
const { auth } = require('../controllers/auth');

const router = express.Router();

//Add or replace a profile picture
router.post('/profilepic', DiscussionGroup.updateProfilePicture);

// Create a new discussion group
router.post('/', DiscussionGroup.create);

// Retrieve all DiscussionGroups
router.get('/', DiscussionGroup.readAll);

// Join a discussion groups
router.post('/joingroup', DiscussionGroup.joingroup);
 
// // Retrieve a single discussion group with this id
router.get('/:id', DiscussionGroup.readOne);

// // Update a discussion group with id
// router.put('/:id', DiscussionGroup.update);

// // Delete a discussion group with id
// router.delete('/:id', DiscussionGroup.delete);

module.exports = router;
