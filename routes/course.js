const express = require('express');
const { Course } = require('../controllers/course');
const { auth } = require('../controllers/auth');

const router = express.Router();

//Add or replace a profile picture
router.post('/profilepic', Course.create);

// Create a new course
router.post('/', Course.create);

// Retrieve all courses
router.get('/', auth.authorize, Course.readAll);
 
// // Retrieve a single course with this id
router.get('/:id', Course.readOne);

// // Update a course with id
// router.put('/:id', Course.update);

// // Delete a course with id
// router.delete('/:id', Course.delete);

module.exports = router;
