const express = require('express');
const { DiscussionMeeting } = require('../controllers/discussionmeeting');
const { auth } = require('../controllers/auth');

const router = express.Router();

//Add or replace a profile picture
router.post('/profilepic', DiscussionMeeting.updateProfilePicture);

// Create a new discussion meeting
router.post('/', DiscussionMeeting.create);

// Retrieve all discussion meetings
router.get('/', DiscussionMeeting.readAll);
 
// // Retrieve a single discussion meeting with this id
router.get('/:id', DiscussionMeeting.readOne);

// // Update a discussion meeting with id
// router.put('/:id', DiscussionMeeting.update);

// // Delete a discussion meeting with id
// router.delete('/:id', DiscussionMeeting.delete);

module.exports = router;
