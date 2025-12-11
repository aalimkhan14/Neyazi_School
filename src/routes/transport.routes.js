const express = require('express');
const router = express.Router();
const Transport_model = require('../models/transport.model');
const Transport_controller = require('../controller/transport.controller');


// Route (GET /teachers/count)
router.get('/count', Transport_controller.count);
// Get all teachers
router.get('/', Transport_controller.findAll);
// Create a new teacher
router.post('/', Transport_controller.create);
// Update a teacher by id
router.put('/:id', Transport_controller.update);
// Delete a teacher by id
router.delete('/:id', Transport_controller.delete);
// Get one by id
router.get('/:id', Transport_controller.findByPk);


module.exports = router;