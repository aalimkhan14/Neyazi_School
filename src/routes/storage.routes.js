const express = require('express');
const router = express.Router();
const Storage_model = require('../models/storage.registration.model');
const Storage_controller = require('../controller/storage.controller');


// Route (GET /teachers/count)
router.get('/count', Storage_controller.count);
// Get all teachers
router.get('/', Storage_controller.findAll);
// Create a new teacher
router.post('/', Storage_controller.create);
// Update a teacher by id
router.put('/:id', Storage_controller.update);
// Delete a teacher by id
router.delete('/:id', Storage_controller.delete);
// Get one by id
router.get('/:id', Storage_controller.findByPk);
// Get one by barcode
router.get('/barcode/:barcode', Storage_controller.findByBarcode);


module.exports = router;