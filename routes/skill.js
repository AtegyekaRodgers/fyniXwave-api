const express = require('express');
const { Skill } = require('../controllers/skill');
const { auth } = require('../controllers/auth');

const router = express.Router();

//Add or replace a profile picture
router.post('/profilepic', Skill.create);

// Create a new skill
router.post('/', Skill.create);

// Retrieve all skills
router.get('/', Skill.readAll);
 
// // Retrieve a single skill with this id
router.get('/:id', Skill.readOne);

// // Update a skill with id
// router.put('/:id', Skill.update);

// // Delete a skill with id
// router.delete('/:id', Skill.delete);

module.exports = router;
