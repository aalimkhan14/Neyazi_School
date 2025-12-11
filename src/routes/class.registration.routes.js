const express = require('express');
const router = express.Router();
const class_model = require('../models/class.registration.model');
const class_controller = require('../controller/class.registration.controller');


// Route (GET /teachers/count)
router.get('/count', class_controller.count);
// Get all teachers
router.get('/', class_controller.findAll);
// Create a new teacher
router.post('/', class_controller.create);
// Update a teacher by id
router.put('/:id', class_controller.update);
// Delete a teacher by id
router.delete('/:id', class_controller.delete);
// Get one by id
router.get('/:id', class_controller.findByPk);


module.exports = router;