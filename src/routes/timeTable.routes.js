const express = require('express');
const router = express.Router();
const timeTable_model = require('../models/timeTable.model');
const timeTable_controller = require('../controller/timeTable.controller');


// Route (GET /teachers/count)
router.get('/count', timeTable_controller.count);
// Get all teachers
router.get('/', timeTable_controller.findAll);
// Create a new teacher
router.post('/', timeTable_controller.create);
// Update a teacher by id
router.put('/:id', timeTable_controller.update);
// Delete a teacher by id
router.delete('/:id', timeTable_controller.delete);
// Get one by id
router.get('/:id', timeTable_controller.findByPk);


module.exports = router;