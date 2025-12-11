const express = require('express');
const router = express.Router();
const class_owner_model = require('../models/class_owner.model');
const class_owner_controller = require('../controller/class_owner.controller');


// Route (GET /class_owenr/count)
router.get('/count', class_owner_controller.count);
// Get all class owenrs
router.get('/', class_owner_controller.findAll);
// Create a new class owner
router.post('/', class_owner_controller.create);
// Update a class owner by id
router.put('/:id', class_owner_controller.update);
// Delete a class owner by id
router.delete('/:id', class_owner_controller.delete);
// Get one by id
router.get('/:id', class_owner_controller.findByPk);


module.exports = router;