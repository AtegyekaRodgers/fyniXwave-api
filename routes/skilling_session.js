const express = require('express');
const { SkillingSession } = require('../controllers/skilling_session');
const { auth } = require('../controllers/auth');

const router = express.Router();

//Add or replace a profile picture
router.post('/profilepic', SkillingSession.create);

// Create a new skillingSession
router.post('/', SkillingSession.create);

// Enroll a learner to this session
router.post('/enroll', SkillingSession.enrolLearner);

// Retrieve all skillingSessions
router.get('/', auth.authorize, SkillingSession.readAll);

// Retrieve skillingSessions for a specific institution
router.get('/institution', SkillingSession.readAllByInstitution);

// Retrieve skillingSessions for a specific classs
router.get('/classs', SkillingSession.readAllByClasss);
 
// Retrieve a single skillingSession with this id
router.get('/:id', SkillingSession.readOne);

// Update a skillingSession with id
router.put('/:id', SkillingSession.update);

// Delete a skillingSession with id
// router.delete('/:id', SkillingSession.delete);

module.exports = router;
