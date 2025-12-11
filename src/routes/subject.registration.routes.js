const express = require('express');
const router = express.Router();
const sujbect_model = require('../models/subject.registration.model');
const subject_controller = require('../controller/subject.registration.controller');


// Route (GET /teachers/count)
router.get('/count', subject_controller.count);
// Get all teachers
router.get('/', subject_controller.findAll);
// Create a new teacher
router.post('/', subject_controller.create);
// Update a teacher by id
router.put('/:id', subject_controller.update);
// Delete a teacher by id
router.delete('/:id', subject_controller.delete);
// Get one by id
router.get('/:id', subject_controller.findByPk);


module.exports = router;