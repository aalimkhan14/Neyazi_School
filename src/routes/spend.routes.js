const express = require('express');
const router = express.Router();
const Spend_model = require('../models/spend.model');
const Spend_controller = require('../controller/spend.controller');

// Route (GET /teachers/count)
router.get('/count', Spend_controller.count);
// Get all teachers
router.get('/', Spend_controller.findAll);
// Create a new teacher
router.post('/', Spend_controller.create);
// Update a teacher by id
router.put('/:id', Spend_controller.update);
// Delete a teacher by id
router.delete('/:id', Spend_controller.delete);
// Get one by id
router.get('/:id', Spend_controller.findByPk);


module.exports = router;