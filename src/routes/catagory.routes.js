const express = require('express');
const router = express.Router();
const Catagory_model = require('../models/catagory.model');
const Catagory_controller = require('../controller/catagory.controller');


// Route (GET /teachers/count)
router.get('/count', Catagory_controller.count);
// Get all teachers
router.get('/', Catagory_controller.findAll);
// Create a new teacher
router.post('/', Catagory_controller.create);
// Update a teacher by id
router.put('/:id', Catagory_controller.update);
// Delete a teacher by id
router.delete('/:id', Catagory_controller.delete);
// Get one by id
router.get('/:id', Catagory_controller.findByPk);


module.exports = router;