const express = require('express');
const { Job } = require('../controllers/job');
const { auth } = require('../controllers/auth');

const router = express.Router();

//Add or replace a profile picture
router.post('/profilepic', Job.updateProfilePicture);

// Create a new job
router.post('/', Job.create);

// Retrieve all jobs
router.get('/', Job.readAll);
 
// // Retrieve a single job with this id
router.get('/:id', Job.readOne);

// // Update a job with id
// router.put('/:id', Job.update);

// // Delete a job with id
// router.delete('/:id', Job.delete);

module.exports = router;
