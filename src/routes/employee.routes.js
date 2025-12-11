const express = require('express');
const router = express.Router();
const employee_model = require('../models/employees.model');
const employee_controller = require('../controller/employees.controller');

// Route (GET /employees/count)
router.get('/count', employee_controller.count);
// Get all employees
router.get('/', employee_controller.findAll);
// Create a new employee
router.post('/', employee_controller.create);
// Update a employee by id
router.put('/:id', employee_controller.update);
// Delete a employee by id
router.delete('/:id', employee_controller.delete);
// Get one by id
router.get('/:id', employee_controller.findByPk);


module.exports = router;