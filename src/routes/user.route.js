const express = require('express');
const router = express.Router();
const user_model = require('../models/user.model');
const user_controller = require('../controller/user.controller');


// Route (GET /teachers/count)
router.get('/count', user_controller.count);
// Get all teachers
router.get('/', user_controller.findAll);
// Create a new teacher
router.post('/', user_controller.create);
// Update a teacher by id
router.put('/:id', user_controller.update);
// Delete a teacher by id
router.delete('/:id', user_controller.delete);
// Get one by id
router.get('/:id', user_controller.findByPk);


module.exports = router;