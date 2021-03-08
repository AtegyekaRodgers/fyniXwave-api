
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
 
// Retrieve a single learner with this id
router.get('/:id', Learner.readOne);

// Update a learner with id
// router.put('/:id', Learner.update);

// Delete a learner with id
// router.delete('/:id', Learner.delete);

// access content that the learner is allowed to
//TODO: router.post('/accesscontent', Learner.accessContent);

// Market courses to a learner
router.post('/marketcourses', Learner.marketCourses);

// Market jobs to a learner
router.post('/marketjobs', Learner.marketJobs);

// Market career sessions to a learner
//TODO: router.post('/marketcareersessions', Learner.marketCareerSessions);

module.exports = router;


