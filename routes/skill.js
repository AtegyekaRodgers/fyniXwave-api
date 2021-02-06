const express = require('express');
const { Skill } = require('../controllers/skill');
const { auth } = require('../controllers/auth');

const router = express.Router();

// Create a new skill
router.post('/', Skill.create);

// Retrieve all skills
router.get('/', auth.authorize, Skill.readAll);
 
// // Retrieve a single skill with this id
router.get('/:id', Skill.readOne);

// // Update a skill with id
// router.put('/:id', Skill.update);

// // Delete a skill with id
// router.delete('/:id', Skill.delete);

module.exports = router;
